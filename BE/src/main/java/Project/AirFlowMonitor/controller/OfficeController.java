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
        List<Office> offices = officeService.getAllOffices();
        return offices;
    }

    @GetMapping("/get-all/{buildingId}")
    public List<Office> getAllOfficesInBuilding(@PathVariable Long buildingId){
        List<Office> officesInBuilding = officeService.getAllOfficesInBuilding(buildingId);
        return officesInBuilding;
    }

    @PostMapping("/create")
    public ResponseEntity<Office> createOffice(@RequestBody CreateOfficeRequest createOfficeRequest) {
        Office office = Office.builder()
                .id(createOfficeRequest.getId())
                .surface(createOfficeRequest.getSurface())
                .capacity(createOfficeRequest.getCapacity())
                .build();
        Optional<Building> optionalBuilding = buildingService.findById(office.getId().getBuildingId());

        return officeService.createOffice(office) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/delete/{buildingId}/{officeId}")
    public ResponseEntity<String> deleteOffice(@PathVariable String officeId, @PathVariable Long buildingId) {
        OfficeId id= new OfficeId();
        id.setOfficeId(officeId);
        id.setBuildingId(buildingId);
        officeService.deleteOffice(id);
        return ResponseEntity.ok("Office deleted successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateOffice(@RequestBody CreateOfficeRequest updatedOffice) {
        Office office= officeService.findById(updatedOffice.getId());

        Office newOffice = Office.builder()
                .id(updatedOffice.getId())
                .surface(updatedOffice.getSurface())
                .capacity(updatedOffice.getCapacity())
                .employees(office.getEmployees())
                .build();
        officeService.updateOffice(newOffice);
        return ResponseEntity.ok("Office updated successfully");
    }
}
