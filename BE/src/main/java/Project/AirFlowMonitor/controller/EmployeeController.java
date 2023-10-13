package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.CreateBuildingRequest;
import Project.AirFlowMonitor.dto.CreateEmployeeRequest;
import Project.AirFlowMonitor.model.Building;
import Project.AirFlowMonitor.model.Employee;
import Project.AirFlowMonitor.service.EmployeeService;
import Project.AirFlowMonitor.service.OfficeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
@AllArgsConstructor
public class EmployeeController {
    @Autowired
    private final EmployeeService service;
    @Autowired
    private final OfficeService officeService;

    @GetMapping("/get-all-by-building_id/{buildingId}")
    public List<Employee> getAllEmployeesByBuildingId(@PathVariable Long buildingId) {
        return service.getAllEmployeesByBuildingId(buildingId);
    }

    @PostMapping("/create")
    public ResponseEntity<Employee> createEmployee(@RequestBody CreateEmployeeRequest employeeRequest) {
        Employee employee = new Employee();
        BeanUtils.copyProperties(employeeRequest, employee);
        employee.setOffice(officeService.findById(employeeRequest.getOfficeId()));
        return service.createEmployee(employee) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
