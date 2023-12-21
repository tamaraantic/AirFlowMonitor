package Project.AirFlowMonitor.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@JsonIgnoreProperties({"employees", "sensorOffices"})
public class Office {
    @EmbeddedId
    private OfficeId id;
    private double surface;
    private int capacity;
    @OneToMany(mappedBy = "office")
    private List<Employee> employees;

}
