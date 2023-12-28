package Project.AirFlowMonitor.repository;

import Project.AirFlowMonitor.model.Installation;
import Project.AirFlowMonitor.model.SensorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorTypeRepository extends JpaRepository<SensorType, Long> {
}
