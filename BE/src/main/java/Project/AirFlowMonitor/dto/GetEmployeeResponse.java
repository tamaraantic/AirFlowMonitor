package Project.AirFlowMonitor.dto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetEmployeeResponse {
    private Long id;
    private String name;
    private String surname;
    private Long officeId;
}
