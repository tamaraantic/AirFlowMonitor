package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.CreateBuildingRequest;
import Project.AirFlowMonitor.model.Building;
import Project.AirFlowMonitor.service.BuildingService;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/building")
@AllArgsConstructor
public class BuildingController {
    @Autowired
    private final BuildingService service;

    @GetMapping("/get-all")
    public List<Building> getAllBuildings(){
        return service.getAllBuildings();
    }

    @PostMapping("/create")
    public ResponseEntity<Building> createBuilding(@RequestBody CreateBuildingRequest createBuildingRequest) {
        Building building = new Building();
        BeanUtils.copyProperties(createBuildingRequest, building);
        return service.createBuilding(building) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

}
