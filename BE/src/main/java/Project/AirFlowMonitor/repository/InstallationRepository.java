package Project.AirFlowMonitor.repository;

import Project.AirFlowMonitor.model.Employee;
import Project.AirFlowMonitor.model.Installation;
import Project.AirFlowMonitor.model.SensorName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstallationRepository extends JpaRepository<Installation, Long> {
    @Query("SELECT i FROM Installation i WHERE i.sensor.sensorType.name = :sensorName and i.office.id.buildingId = :buildingId and i.office.id.officeId = :officeId")
    List<Installation> findInstallationBySensorNameAndOffice(@Param("buildingId") Long buildingId, @Param("officeId") String officeId, @Param("sensorName") SensorName sensorName);
}
