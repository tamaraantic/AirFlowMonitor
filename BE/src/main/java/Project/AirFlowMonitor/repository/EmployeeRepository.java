package Project.AirFlowMonitor.repository;

import Project.AirFlowMonitor.model.Building;
import Project.AirFlowMonitor.model.Employee;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Query("SELECT e FROM Employee e WHERE e.office.id.buildingId = :buildingId")
    List<Employee> findEmployeesByBuildingId(@Param("buildingId") Long buildingId);

    Employee findByEmail(String email);

    void deleteByEmail(String email);
}
