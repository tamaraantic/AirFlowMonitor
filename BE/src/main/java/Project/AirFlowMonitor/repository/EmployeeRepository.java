package Project.AirFlowMonitor.repository;

import Project.AirFlowMonitor.model.Building;
import Project.AirFlowMonitor.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Query("SELECT e FROM Employee e WHERE e.office.id.buildingId = :buildingId")
    List<Employee> findEmployeesByBuildingId(@Param("buildingId") Long buildingId);
}
