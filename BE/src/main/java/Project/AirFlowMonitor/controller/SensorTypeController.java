package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.CreateOfficeRequest;
import Project.AirFlowMonitor.model.*;
import Project.AirFlowMonitor.service.SensorTypeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sensor-type")
@AllArgsConstructor
public class SensorTypeController {
    @Autowired
    private final SensorTypeService sensorTypeService;

    @GetMapping("/get-all")
    public List<SensorType> getAllSensorTypes(){
        List<SensorType> sensorTypes = sensorTypeService.getAllSensorTypes();
        return sensorTypes;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSensorType(@PathVariable Long id) {
        sensorTypeService.deleteSensorType(id);
        return ResponseEntity.ok("Sensor Type deleted successfully");
    }

    @PostMapping("/create")
    public ResponseEntity<SensorType> createSensorTYpe(@RequestBody SensorType sensorType) {
        return sensorTypeService.createSensorType(sensorType) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateSensorType(@RequestBody SensorType updatedSensorType) {
        sensorTypeService.updateSensorType(updatedSensorType);
        return ResponseEntity.ok("Sensor Type updated successfully");
    }
}
