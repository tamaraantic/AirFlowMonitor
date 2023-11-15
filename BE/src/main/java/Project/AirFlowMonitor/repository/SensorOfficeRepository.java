package Project.AirFlowMonitor.repository;

import Project.AirFlowMonitor.model.Office;
import Project.AirFlowMonitor.model.SensorOffice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorOfficeRepository extends JpaRepository<SensorOffice, Long> {
}
