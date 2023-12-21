package Project.AirFlowMonitor.repository;

import Project.AirFlowMonitor.model.Installation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorOfficeRepository extends JpaRepository<Installation, Long> {
}
