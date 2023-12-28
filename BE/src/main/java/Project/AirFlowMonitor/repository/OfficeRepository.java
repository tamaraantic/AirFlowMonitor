package Project.AirFlowMonitor.repository;

import Project.AirFlowMonitor.model.Office;
import Project.AirFlowMonitor.model.OfficeId;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfficeRepository extends JpaRepository<Office, OfficeId> {
    @NotNull
    Optional<Office> findById(OfficeId id);
}
