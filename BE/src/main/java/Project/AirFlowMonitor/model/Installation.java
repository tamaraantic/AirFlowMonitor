package Project.AirFlowMonitor.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Installation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateOfInstallation;
    private LocalDateTime dateOfRemoval;
    @ManyToOne
    private Sensor sensor;
    @ManyToOne
    private Office office;

}
