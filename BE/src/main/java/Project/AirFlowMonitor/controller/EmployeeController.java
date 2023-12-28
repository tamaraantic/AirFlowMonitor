package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.*;
import Project.AirFlowMonitor.model.*;
import Project.AirFlowMonitor.repository.InOutEventRepository;
import Project.AirFlowMonitor.service.EmailService;
import Project.AirFlowMonitor.service.EmployeeService;

import Project.AirFlowMonitor.service.NotificationService;
import Project.AirFlowMonitor.service.OfficeService;
import jakarta.persistence.EntityNotFoundException;
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

    @DeleteMapping("delete/{employeeEmail}")
    public ResponseEntity<String> deleteEmployee( @PathVariable String employeeEmail) {
        service.deleteEmployee(employeeEmail);
        return ResponseEntity.ok("Employee deleted successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateOffice(@RequestBody UpdateEmployeeRequest updateEmployee) {
        Employee employee= service.findByEmail(updateEmployee.getEmail());

        Employee newEmployee = Employee.builder()
                .id(employee.getId())
                .name(updateEmployee.getFirstname())
                .surname(updateEmployee.getLastname())
                .email(updateEmployee.getEmail())
                .password(employee.getPassword())
                .role(updateEmployee.getRole())
                .office(employee.getOffice())
                .build();
        service.updateEmployee(newEmployee);
        return ResponseEntity.ok("Employee updated successfully");
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
        emailService.sendMail("itcompanyns@gmail.com",filteredEmails.toArray(new String[0]), "URGENT!", formEmail(notification));
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
        return employee.getRole() == Role.SECURITY;
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
        emailService.sendMail("itcompanyns@gmail.com",emails.toArray(new String[0]), "IMMEDIATELY EVACUATE THE BUILDING!", formAlertEmail(notification));
    }

    public String formAlertEmail(Notification notification){
        String email =   "Dear Sir/Madam,\n" +
                "\n" +
                "IMMEDIATELY EVACUATE THE BUILDING!\n" +
                "\n" +
                "Sincerely,\n" +
                "Antic Systems";
        return email;
    }


    public String formEmail(Notification notification){
        String email =   "Dear Sir/Madam,\n" +
                "\n" +
                "We would like to inform you that the sensor in the room has detected an unusually high value. Here are the details:\n" +
                "\n" +
                "Office: "+ notification.getCheckName()+"\n" +
                "Sensor value: "+ notification.getValue()+"\n" +
                "Measurement time: "+notification.getTime()+"\n" +
                "\n" +
                "Please evacuate the premises immediately and assess the situation. If you notice anything unusual or have additional questions, please contact the concierge.\n" +
                "\n" +
                "Thank you for your cooperation.\n" +
                "\n" +
                "Sincerely,\n" +
                "Antic Systems";
        return email;

    }


}
