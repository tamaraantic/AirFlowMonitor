package Project.AirFlowMonitor.service;

import Project.AirFlowMonitor.model.Office;
import Project.AirFlowMonitor.model.SensorName;
import Project.AirFlowMonitor.model.SensorType;
import Project.AirFlowMonitor.repository.BuildingRepository;
import Project.AirFlowMonitor.repository.SensorTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class SensorTypeService {

    private final SensorTypeRepository repo;
    @Transactional(readOnly = true)
    public List<SensorType> getAllSensorTypes() {
        List<SensorType> sensorTypes = repo.findAll();
        return sensorTypes;
    }
    public SensorType findBySensorName(SensorName sensorName){
        List<SensorType> sensorTypes = repo.findAll();
        List<SensorType> filteredSensorTypes = new ArrayList<>();
        for (SensorType sensorType: sensorTypes) {
            if (sensorType.getName().equals(sensorName)){
                filteredSensorTypes.add(sensorType);
            }
        }
        return filteredSensorTypes.stream().findFirst().orElse(null);
    }

    @Transactional
    public void deleteSensorType(Long id) {
        repo.deleteById(id);
    }

    public boolean createSensorType(SensorType sensorType) {
        try {
            repo.save(sensorType);
            return true;
        } catch (DataAccessException e) {
            System.out.println("Error while saving SensorType object: " + e.getMessage());
            return false;
        }
    }

    public void updateSensorType(SensorType updatedSensorType) {
        if (repo.existsById(updatedSensorType.getId())) {
            repo.save(updatedSensorType);
        } else {
            throw new EntityNotFoundException("Sensor Type not found with id: " + updatedSensorType.getId());
        }
    }
}
