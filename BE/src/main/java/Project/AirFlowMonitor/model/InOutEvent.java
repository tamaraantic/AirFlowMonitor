package Project.AirFlowMonitor.model;

import com.influxdb.annotations.Column;
import com.influxdb.annotations.Measurement;
import lombok.Data;

import java.time.Instant;

@Data
@Measurement(name="InOutEvent")
public class InOutEvent {

    @Column(timestamp = true)
    Instant lastInspected;

    @Column(tag = true)
    Long employeeId;

    @Column
    String direction;
}
