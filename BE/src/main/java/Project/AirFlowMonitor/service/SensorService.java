package Project.AirFlowMonitor.service;

import Project.AirFlowMonitor.model.Installation;
import Project.AirFlowMonitor.model.OfficeId;
import Project.AirFlowMonitor.model.Sensor;
import Project.AirFlowMonitor.repository.SensorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class SensorService {
    private final SensorRepository repo;

    public Sensor findBySerialNum(Long id) {
        return (Sensor) repo.findBySerialNum(id)
                .orElseThrow(() -> new EntityNotFoundException("Sensor not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Sensor> getAllSensors() {
        List<Sensor> sensors = repo.findAll();
        return sensors;
    }

    public void deleteSensor(Long id) {
        repo.deleteById(id);
    }

    public boolean createSensor(Sensor sensor) {
        try {
            repo.save(sensor);
            return true;
        } catch (DataAccessException e) {
            System.out.println("Error while saving Sensor object: " + e.getMessage());
            return false;
        }
    }
}
