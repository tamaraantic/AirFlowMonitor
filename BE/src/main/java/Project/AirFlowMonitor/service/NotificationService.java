package Project.AirFlowMonitor.service;

import Project.AirFlowMonitor.dto.Notification;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
@Service
@AllArgsConstructor
public class NotificationService {

    public Notification parseNotification(String string) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode json = objectMapper.readTree(string);
        Notification notification = new Notification();

        notification.setCheckName(json.get("_check_name").asText());
        notification.setTime(json.get("_time").asText());
        notification.setLevel(json.get("_level").asText());

        if (json.has("temperature")) {
            notification.setValue(json.get("temperature").asDouble());
        } else if (json.has("co")) {
            notification.setValue(json.get("co").asDouble());
        } else if (json.has("humidity")) {
            notification.setValue(json.get("humidity").asDouble());
        }

        return notification;
    }
}
