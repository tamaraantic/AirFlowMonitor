package Project.AirFlowMonitor.service;

import Project.AirFlowMonitor.model.Building;
import Project.AirFlowMonitor.model.Office;
import Project.AirFlowMonitor.repository.OfficeRepository;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        return repo.findAll();
    }
}
