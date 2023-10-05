package Project.AirFlowMonitor.model;

import jakarta.persistence.*;

import lombok.Data;
import java.util.List;

@Data
@Entity
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
}