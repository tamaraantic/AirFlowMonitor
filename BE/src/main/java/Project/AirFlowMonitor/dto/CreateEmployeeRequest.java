package Project.AirFlowMonitor.dto;

import Project.AirFlowMonitor.model.OfficeId;
import lombok.Data;

@Data
public class CreateEmployeeRequest {
    private String name;
    private String surname;
    private String email;
    private OfficeId officeId;
}
