package Project.AirFlowMonitor.service;

import Project.AirFlowMonitor.model.Building;
import Project.AirFlowMonitor.repository.BuildingRepository;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BuildingService {
    private final BuildingRepository repo;

    public boolean createBuilding(Building building) {
        try {
            repo.save(building);
            return true;
        } catch (DataAccessException e) {
            System.out.println("Error while saving Building object: " + e.getMessage());
            return false;
        }
    }

    @Transactional(readOnly = true)
    public List<Building> getAllBuildings() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Building> findById(Long buildingId) {
        return repo.findById(buildingId);
    }
}
