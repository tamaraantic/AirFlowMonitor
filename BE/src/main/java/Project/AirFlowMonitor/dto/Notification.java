package Project.AirFlowMonitor.dto;

import lombok.Data;

@Data
public class Notification {
    private String checkName;
    private String time;
    private String level;
    private Double value;
}
