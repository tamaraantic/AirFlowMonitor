package Project.AirFlowMonitor.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Office {
    @EmbeddedId
    private OfficeId id;
    private double surface;
    private int capacity;

    @OneToMany(mappedBy = "office")
    private List<Employee> employees;

    @OneToMany(mappedBy = "office")
    private List<SensorOffice> sensorOffices;
}
