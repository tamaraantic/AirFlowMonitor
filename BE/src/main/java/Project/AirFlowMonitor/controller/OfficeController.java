package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.CreateOfficeRequest;
import Project.AirFlowMonitor.model.Building;
import Project.AirFlowMonitor.model.Office;
import Project.AirFlowMonitor.model.OfficeId;
import Project.AirFlowMonitor.service.BuildingService;
import Project.AirFlowMonitor.service.OfficeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/office")
@AllArgsConstructor
public class OfficeController {
    @Autowired
    private final OfficeService officeService;
    @Autowired
    private final BuildingService buildingService;


    @GetMapping("/get-all")
    public List<Office> getAllOffices(){
        return officeService.getAllOffices();
    }

    @PostMapping("/create")
    public ResponseEntity<Office> createOffice(@RequestBody CreateOfficeRequest createOfficeRequest) {
        Office office = new Office();
        OfficeId officeId = new OfficeId();
        officeId.setBuildingId(createOfficeRequest.getId().getBuildingId());
        officeId.setOfficeId(createOfficeRequest.getId().getOfficeId());
        office.setId(officeId);
        office.setSurface(createOfficeRequest.getSurface());
        office.setCapacity(createOfficeRequest.getCapacity());
        Optional<Building> optionalBuilding = buildingService.findById(officeId.getBuildingId());

        return officeService.createOffice(office) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
