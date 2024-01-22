package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.CreateOfficeRequest;
import Project.AirFlowMonitor.dto.GetInstallationRequest;
import Project.AirFlowMonitor.dto.GetSensorResponse;
import Project.AirFlowMonitor.model.*;
import Project.AirFlowMonitor.service.SensorService;
import Project.AirFlowMonitor.service.SensorTypeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import retrofit2.http.GET;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sensor")
@AllArgsConstructor
public class SensorController {
    @Autowired
    private final SensorService sensorService;
    @Autowired
    private final SensorTypeService sensorTypeService;

    @GetMapping("/get-all")
    public List<GetSensorResponse> getAllSensors() {
        List<Sensor> sensors = sensorService.getAllSensors();
        List<GetSensorResponse> sensorResponses = sensors.stream()
                .map(sensor -> GetSensorResponse.builder()
                        .serialNum(sensor.getSerialNum())
                        .name(sensor.getSensorType().getName().toString())
                        .build())
                .collect(Collectors.toList());
        return sensorResponses;
    }

    @DeleteMapping("delete/{serialNum}")
    public ResponseEntity<String> deleteSensorBySerialNum(@PathVariable Long serialNum) {
        Sensor sensor= sensorService.findBySerialNum(serialNum);
        sensorService.deleteSensor(sensor.getId());
        return ResponseEntity.ok("Sensor deleted successfully");
    }

    @PostMapping("/create")
    public ResponseEntity<Sensor> createSensor(@RequestBody GetSensorResponse createSensorRequest) {
        SensorType sensorType = sensorTypeService.findBySensorName(SensorName.valueOf(createSensorRequest.getName()));
        Sensor sensor = Sensor.builder()
                .serialNum(createSensorRequest.getSerialNum())
                .sensorType(sensorType)
                .build();

        return sensorService.createSensor(sensor) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

}
