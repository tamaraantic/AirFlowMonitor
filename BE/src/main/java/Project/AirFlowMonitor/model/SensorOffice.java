package Project.AirFlowMonitor.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SensorOffice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double minimal;
    private double maximal;
    private double optimal;
    @ManyToOne
    private Office office;
    @ManyToOne
    private Sensor sensor;
}
