package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.CreateEmployeeRequest;
import Project.AirFlowMonitor.dto.GetEmployeeRequest;
import Project.AirFlowMonitor.dto.Notification;
import Project.AirFlowMonitor.dto.TextDTO;
import Project.AirFlowMonitor.model.Employee;
import Project.AirFlowMonitor.model.EmployeeType;
import Project.AirFlowMonitor.model.InOutEvent;
import Project.AirFlowMonitor.repository.InOutEventRepository;
import Project.AirFlowMonitor.service.EmailService;
import Project.AirFlowMonitor.service.EmployeeService;

import Project.AirFlowMonitor.service.NotificationService;
import Project.AirFlowMonitor.service.OfficeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/employee")
@AllArgsConstructor
public class EmployeeController {
    @Autowired
    private final EmployeeService service;
    @Autowired
    private final OfficeService officeService;
    @Autowired
    private final WebSocketController webSocketController;
    @Autowired
    private final EmailService emailService;
    @Autowired
    private final NotificationService notificationService;
    @Autowired
    private final InOutEventRepository inOutEventRepository;

    @GetMapping("/get-all-by-building_id/{buildingId}")
    public List<Employee> getAllEmployeesByBuildingId(@PathVariable Long buildingId) {
        return service.getAllEmployeesByBuildingId(buildingId);
    }

    @GetMapping("/get-all-dto-by-building_id/{buildingId}")
    public List<GetEmployeeRequest> getAllEmployeesDTOByBuildingId(@PathVariable Long buildingId) {
        List<Employee> list= service.getAllEmployeesByBuildingId(buildingId);
        List<GetEmployeeRequest> dtoList = list.stream()
                .map(emp -> {
                    GetEmployeeRequest dto = new GetEmployeeRequest();
                    BeanUtils.copyProperties(emp, dto);
                    return dto;
                })
                .collect(Collectors.toList());
        return dtoList;
    }
    @PostMapping("/create")
    public ResponseEntity<Employee> createEmployee(@RequestBody CreateEmployeeRequest employeeRequest) {
        Employee employee = new Employee();
        BeanUtils.copyProperties(employeeRequest, employee);
        employee.setOffice(officeService.findById(employeeRequest.getOfficeId()));
        return service.createEmployee(employee) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
    public List<Employee> getAllEmployesInside(){
        List<InOutEvent> inOutEvents = inOutEventRepository.getAllEmployeesInside();
        List<Employee> employeesInside= new ArrayList<>();
        for (InOutEvent event: inOutEvents) {
            employeesInside.add(service.findById(event.getEmployeeId()).orElse(null));
        }
        return employeesInside;
    }

    public List<String> getEmployeesEmails(List<Employee> employees){
        List<String> emails= new ArrayList<>();
        for (Employee employee: employees) {
            emails.add(employee.getEmail());
        }
        return  emails;
    }

    @PostMapping("/info")
    public String alertHandler(@RequestBody String info) throws Exception{
        Notification notification= notificationService.parseNotification(info);
        System.out.println(notification.toString());
        sendNotification(notification);
        //sendEmail(notification);
        return info;
    }
//PREBACI U NOTIFICATION SERVICE/KONTROLER
    public void sendNotification(Notification notification){
        TextDTO popUp = new TextDTO();
        popUp.setMessage(notification.toString());
        webSocketController.sendMessage(popUp);
    }
    public void sendEmail(Notification notification){
        List<String> emails = getEmployeesEmails(getAllEmployesInside());
        List<String> filteredEmails = filterEmails(emails, notification);
        emailService.sendMail("itcompanyns@gmail.com",filteredEmails.toArray(new String[0]), "HITNO!", formEmail(notification));
    }

    public List<String> filterEmails(List<String> emails, Notification notification) {
        List<String> filteredEmails = new ArrayList<>();

        for (String employeeEmail : emails) {
            Employee employee = service.findByEmail(employeeEmail);

            if (isMaintenanceWorker(employee) || isMatchingOffice(employee, notification)) {
                filteredEmails.add(employeeEmail);
            }
        }

        return filteredEmails;
    }

    private boolean isMaintenanceWorker(Employee employee) {
        return employee.getType() == EmployeeType.MAINTENANCE_WORKER;
    }

    private boolean isMatchingOffice(Employee employee, Notification notification) {
        String officeId = employee.getOffice().getId().getOfficeId();

        if ("crit".equals(notification.getLevel())) {
            return isMaintenanceWorker(employee) || officeId.substring(0, 5).equals(notification.getCheckName().substring(0, 5));
        } else if ("warn".equals(notification.getLevel())) {
            return isMaintenanceWorker(employee) || officeId.equals(notification.getCheckName());
        }

        return false;
    }

    @PostMapping("/alert-all")
    public void alertAll(Notification notification){
        List<String> emails = getEmployeesEmails(getAllEmployesInside());
        emailService.sendMail("itcompanyns@gmail.com",emails.toArray(new String[0]), "ODMAH NAPUSTITE ZGRADU!", formAlertEmail(notification));
    }

    public String formAlertEmail(Notification notification){
        String email =   "Poštovani,\n" +
                "\n" +
                "ODMAH NAPUSTITE ZGRADU!\n" +
                "\n" +
                "S poštovanjem,\n" +
                "Antic Systems";
        return email;
    }

    public String formEmail(Notification notification){
        String email =   "Poštovani,\n" +
                "\n" +
                "Želimo vas obavijestiti da je senzor u sobi izmjerio neobično visoku vrijednost. Evo detalja:\n" +
                "\n" +
                "Soba: "+ notification.getCheckName()+"\n" +
                "Vrijednost senzora: "+ notification.getValue()+"\n" +
                "Vrijeme mjerenja: "+notification.getTime()+"\n" +
                "\n" +
                "Molimo vas da odmah napustite prostorije i provjerite situaciju. Ako primijetite nešto neobično ili imate dodatna pitanja, obratite se portiru.\n" +
                "\n" +
                "Hvala vam na suradnji.\n" +
                "\n" +
                "S poštovanjem,\n" +
                "Antic Systems";
        return email;
    }


}
