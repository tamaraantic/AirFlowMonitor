package Project.AirFlowMonitor.service;

import Project.AirFlowMonitor.model.Employee;
import Project.AirFlowMonitor.model.Office;
import Project.AirFlowMonitor.model.OfficeId;
import Project.AirFlowMonitor.repository.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EmployeeService {
    private final EmployeeRepository repo;
    @Transactional(readOnly = true)
    public List<Employee> getAllEmployeesByBuildingId(Long buidingId) {return repo.findEmployeesByBuildingId(buidingId);}

    public boolean createEmployee(Employee employee) {
        try {
            repo.save(employee);
            return true;
        } catch (DataAccessException e) {
            System.out.println("Error while saving Employee object: " + e.getMessage());
            return false;
        }
    }
    public Optional<Employee> findById(Long id){
        return repo.findById(id);
    }
    public Employee findByEmail(String email){
        return repo.findByEmail(email);
    }
    @Transactional
    public void deleteEmployee(String email) {
        repo.deleteByEmail(email);
    }

    public void updateEmployee(Employee updatedEmployee) {
        if (repo.existsById(updatedEmployee.getId())) {
            repo.save(updatedEmployee);
        } else {
            throw new EntityNotFoundException("Employee not found with id: " + updatedEmployee.getId());
        }
    }

}
