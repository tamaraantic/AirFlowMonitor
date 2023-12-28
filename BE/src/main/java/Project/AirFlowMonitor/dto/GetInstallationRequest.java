package Project.AirFlowMonitor.dto;

import Project.AirFlowMonitor.model.SensorName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetInstallationRequest {
    private Long id;
    private LocalDateTime dateOfInstallation;
    private LocalDateTime dateOfRemoval;
    private Long serialNum;
    private String name;
    private Long buildingId;
    private String officeId;
}
