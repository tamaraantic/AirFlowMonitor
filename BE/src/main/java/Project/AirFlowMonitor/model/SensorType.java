package Project.AirFlowMonitor.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SensorType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private SensorName name;
    private double minimal;
    private double maximal;
    private double optimal;
}
