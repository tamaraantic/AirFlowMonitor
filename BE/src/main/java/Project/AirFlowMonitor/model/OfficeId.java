package Project.AirFlowMonitor.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class OfficeId {
    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "office_id")
    private String officeId;

}
