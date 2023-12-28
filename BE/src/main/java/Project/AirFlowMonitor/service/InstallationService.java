package Project.AirFlowMonitor.service;

import Project.AirFlowMonitor.dto.GetInstallationRequest;
import Project.AirFlowMonitor.model.Installation;
import Project.AirFlowMonitor.model.SensorName;
import Project.AirFlowMonitor.repository.InstallationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InstallationService {
    private final InstallationRepository repo;
    @Transactional(readOnly = true)
    public List<Installation> getAllInstallations() {
        List<Installation> installations = repo.findAll();
        return installations;
    }
    @Transactional
    public void deleteInstallation(Long id) {
        repo.deleteById(id);
    }

    public Installation findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Installation not found with id: " + id));
    }

    public void updateInstallation(Installation updatedInstallation) {
        if (repo.existsById(updatedInstallation.getId())) {
            repo.save(updatedInstallation);
        } else {
            throw new EntityNotFoundException("Office not found with id: " + updatedInstallation.getId());
        }
    }

    public List<Installation> findInstallationBySensorNameAndOffice(Long buildingId, String officeId, SensorName sensorName){
        return repo.findInstallationBySensorNameAndOffice(buildingId, officeId, sensorName);
    }

    public boolean createInstallation(Installation installation) {
        try {
            repo.save(installation);
            return true;
        } catch (DataAccessException e) {
            System.out.println("Error while saving Installation object: " + e.getMessage());
            return false;
        }
    }
}
