package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.CreateEmployeeRequest;
import Project.AirFlowMonitor.dto.GetEmployeeRequest;
import Project.AirFlowMonitor.dto.Notification;
import Project.AirFlowMonitor.dto.TextDTO;
import Project.AirFlowMonitor.model.Employee;
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
    @PostMapping("/info")
    public String info(@RequestBody String info) throws Exception{
        Notification notification= notificationService.parseNotification(info);
        System.out.println(notification.toString());
        TextDTO text = new TextDTO();
        text.setMessage(notification.toString());
        webSocketController.sendMessage(text);
        //List<String> emails = getEmployeesEmails(getAllEmployesInside());
        //emailService.sendMail("itcompanyns@gmail.com",emails.toArray(new String[0]), "SUBJECT", info);
        return info;
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



}
