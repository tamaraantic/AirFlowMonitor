package Project.AirFlowMonitor.dto;

import Project.AirFlowMonitor.model.OfficeId;
import lombok.Data;

@Data
public class CreateOfficeRequest {
    private OfficeId id;
    private double surface;
    private int capacity;
}
