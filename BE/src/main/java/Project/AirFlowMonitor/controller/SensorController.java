package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.GetInstallationRequest;
import Project.AirFlowMonitor.dto.GetSensorResponse;
import Project.AirFlowMonitor.model.Sensor;
import Project.AirFlowMonitor.service.SensorService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import retrofit2.http.GET;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sensor")
@AllArgsConstructor
public class SensorController {
    @Autowired
    private final SensorService sensorService;

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

}
