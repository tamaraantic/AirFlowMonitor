package Project.AirFlowMonitor.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfficeId {
    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "office_id")
    private String officeId;

}
