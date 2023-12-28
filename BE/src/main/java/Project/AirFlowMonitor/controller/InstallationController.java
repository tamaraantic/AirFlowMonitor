package Project.AirFlowMonitor.controller;

import Project.AirFlowMonitor.dto.CreateOfficeRequest;
import Project.AirFlowMonitor.dto.GetInstallationRequest;
import Project.AirFlowMonitor.model.*;
import Project.AirFlowMonitor.service.InstallationService;
import Project.AirFlowMonitor.service.OfficeService;
import Project.AirFlowMonitor.service.SensorService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/installation")
@AllArgsConstructor
public class InstallationController {
    @Autowired
    private final InstallationService installationService;
    @Autowired
    private final OfficeService officeService;
    @Autowired
    private final SensorService sensorService;

    @GetMapping("/get-all")
    public List<GetInstallationRequest> getAllOffices(){
        List<Installation> installations = installationService.getAllInstallations();
        List<GetInstallationRequest> installationRequests = installations.stream()
                .map(installation -> GetInstallationRequest.builder()
                        .id(installation.getId())
                        .dateOfInstallation(installation.getDateOfInstallation())
                        .dateOfRemoval(installation.getDateOfRemoval())
                        .serialNum(installation.getSensor().getSerialNum())  // Pretpostavljam da se serialNum nalazi u Sensor klasi
                        .name(installation.getSensor().getSensorType().getName().toString())
                        .buildingId(installation.getOffice().getId().getBuildingId())  // Pretpostavljam da se buildingId nalazi u Building klasi
                        .officeId(installation.getOffice().getId().getOfficeId())
                        .build())
                .collect(Collectors.toList());
        return installationRequests;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteInstallation(@PathVariable Long id) {
        installationService.deleteInstallation(id);
        return ResponseEntity.ok("Installation deleted successfully");
    }

    @PostMapping("/create")
    public ResponseEntity<Office> createInstallation(@RequestBody GetInstallationRequest getInstallationRequest) {
        OfficeId officeId = OfficeId.builder()
                .officeId(getInstallationRequest.getOfficeId())
                .buildingId(getInstallationRequest.getBuildingId())
                .build();

        Office office = officeService.findById(officeId);
        Sensor sensor= sensorService.findBySerialNum(getInstallationRequest.getSerialNum());
        Installation installation = Installation.builder()
                .id(getInstallationRequest.getId())
                .dateOfInstallation(getInstallationRequest.getDateOfInstallation())
                .dateOfRemoval(getInstallationRequest.getDateOfRemoval())
                .sensor(sensor)
                .office(office)
                .build();

        return installationService.createInstallation(installation) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateInstallation(@RequestBody GetInstallationRequest getInstallationRequest){
        Installation installation = installationService.findById(getInstallationRequest.getId());

        SensorType newSensorType= SensorType.builder()
                .id(installation.getSensor().getSensorType().getId())
                .maximal(installation.getSensor().getSensorType().getMaximal())
                .minimal(installation.getSensor().getSensorType().getMinimal())
                .optimal(installation.getSensor().getSensorType().getOptimal())
                .name(SensorName.valueOf(getInstallationRequest.getName()))
                .build();

        Sensor newSensor = Sensor.builder()
                .id(installation.getSensor().getId())
                .serialNum(installation.getSensor().getSerialNum())
                .sensorType(newSensorType)
                .build();

        Installation newInstallation = Installation.builder()
                .id(getInstallationRequest.getId())
                .dateOfInstallation(getInstallationRequest.getDateOfInstallation())
                .dateOfRemoval(getInstallationRequest.getDateOfRemoval())
                .sensor(newSensor)
                .office(installation.getOffice())
                .build();

        installationService.updateInstallation(newInstallation);
        return ResponseEntity.ok("Installation updated successfully");
    }

    @GetMapping("find-by/{buildingId}/{officeId}/{sensorName}")
    public ResponseEntity<String> getSecondsFromInstallation(@PathVariable Long buildingId, @PathVariable String officeId,@PathVariable String sensorName ){
        System.out.println("joj kuku");
        List<Installation> installations = installationService.findInstallationBySensorNameAndOffice(buildingId,officeId, SensorName.valueOf(sensorName));
        Installation installation = installations.stream().findFirst().orElse(null);
        if (installation == null){
            return ResponseEntity.ok("0");
        }
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime installationTime= installation.getDateOfInstallation();
        Duration duration = Duration.between(installationTime, now);
        long seconds = duration.getSeconds();
        return ResponseEntity.ok(String.valueOf(seconds));
    }
}
