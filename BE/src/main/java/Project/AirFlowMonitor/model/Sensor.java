package Project.AirFlowMonitor.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Sensor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private SensorType type;
    @OneToOne
    private SensorOffice sensorOffice;
}
