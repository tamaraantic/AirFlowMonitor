package Project.AirFlowMonitor.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"employees", "sensorOffices"})
public class Office {
    @EmbeddedId
    private OfficeId id;
    private double surface;
    private int capacity;
    @OneToMany(mappedBy = "office")
    private List<Employee> employees;

}
