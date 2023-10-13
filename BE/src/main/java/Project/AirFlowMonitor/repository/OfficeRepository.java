package Project.AirFlowMonitor.repository;

import Project.AirFlowMonitor.model.Office;
import Project.AirFlowMonitor.model.OfficeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfficeRepository extends JpaRepository<Office, Long> {
    Office findById(OfficeId id);
}
