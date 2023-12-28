package Project.AirFlowMonitor.dto;

import Project.AirFlowMonitor.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEmployeeRequest {
    private String firstname;
    private String lastname;
    private String email;
    private Role role;
}
