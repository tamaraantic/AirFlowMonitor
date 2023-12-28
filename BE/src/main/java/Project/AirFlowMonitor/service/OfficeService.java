package Project.AirFlowMonitor.service;

import Project.AirFlowMonitor.model.Building;
import Project.AirFlowMonitor.model.Office;
import Project.AirFlowMonitor.model.OfficeId;
import Project.AirFlowMonitor.repository.OfficeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class OfficeService {
    private final OfficeRepository repo;

    public boolean createOffice(Office office) {
        try {
            repo.save(office);
            return true;
        } catch (DataAccessException e) {
            System.out.println("Error while saving Office object: " + e.getMessage());
            return false;
        }
    }

    @Transactional(readOnly = true)
    public List<Office> getAllOffices() {
        List<Office> offices = repo.findAll();
        return offices;
    }

    @Transactional(readOnly = true)
    public List<Office> getAllOfficesInBuilding(Long buildingId) {
        List<Office> offices = repo.findAll();
        List<Office> officesInBuilding = new ArrayList<>();
        for (Office office: offices) {
            if (office.getId().getBuildingId()==buildingId){officesInBuilding.add(office);}
        }
        return officesInBuilding;
    }

    public Office findById(OfficeId id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Office not found with id: " + id));
    }

    public void deleteOffice(OfficeId id) {
        repo.deleteById(id);
    }

    public void updateOffice(Office updatedOffice) {
        if (repo.existsById(updatedOffice.getId())) {
            repo.save(updatedOffice);
        } else {
            throw new EntityNotFoundException("Office not found with id: " + updatedOffice.getId());
        }
    }
}
