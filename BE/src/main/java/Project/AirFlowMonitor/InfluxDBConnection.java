package Project.AirFlowMonitor;

import Project.AirFlowMonitor.model.Sensor;
import Project.AirFlowMonitor.model.Installation;
import Project.AirFlowMonitor.repository.InstallationRepository;
import Project.AirFlowMonitor.repository.SensorRepository;
import com.influxdb.client.*;
import com.influxdb.client.domain.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Configuration
@Data
public class InfluxDBConnection {
    private String token = "jPfaxnHaSVwvDOQ2dooykPr6nH-cLBGsvRz9y_oyLEhgtm5xNYDN5s6hnS6I-Qdnrm5U61ug7VZsEc7P-ljyuw==";
    private String bucket = "buildingEvents";
    private String org = "ftn";
    private String url = "http://localhost:8086";
    private String airSensorBucket= "airSensor-RT";

    @Bean
    public InfluxDBClient buildConnection() {
        return InfluxDBClientFactory.create(getUrl(), getToken().toCharArray(), getOrg(), getAirSensorBucket());
    }

    @Autowired
    private InstallationRepository installationRepository;
    @Autowired
    private SensorRepository sensorRepository;

    public void deleteCheckByName(String checkName) throws IOException, InterruptedException {
        //try (InfluxDBClient client = buildConnection()) {
            InfluxDBClient client = buildConnection();
            ChecksApi checksApi = client.getChecksApi();
            List<Check> existingChecks = checksApi.findChecks("0a0a50622ace9576");

            // Pronađi check po imenu
            Optional<Check> checkToDelete = existingChecks.stream()
                    .filter(check -> check.getName().equals(checkName))
                    .findFirst();

            if (!checkToDelete.isPresent()){
                return;
            }

            // Pronađi sve check-ove
            String orgId = "0a0a50622ace9576";
            String deleteUrl = "http://localhost:8086" + "/api/v2/checks/" + checkToDelete.get().getId() + "?orgID=" + orgId;
            String deleteCheckToken="482dVubThiOToUIjItA-TzbE5V-u7LE2tsSXUMhUKjCBfkPwCV-Bfja-XKoCZWl-p74Kjo1ClgPGkg0-dSZCxQ==";

                HttpRequest deleteRequest = HttpRequest.newBuilder()
                        .uri(URI.create(deleteUrl))
                        .header("Authorization", "Token " + deleteCheckToken)
                        .DELETE()
                        .build();

                HttpResponse<String> response = HttpClient.newHttpClient().send(deleteRequest, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 204) {
                    System.out.println("Check uspešno obrisan.");
                } else {
                    System.err.println("Neuspešno brisanje check-a. HTTP Status Code: " + response.statusCode());
                }


    }


    public void createOrUpdateCheck() {
            InfluxDBClient client = buildConnection();
            QueryApi queryApi = client.getQueryApi();
            ChecksApi checksApi = client.getChecksApi();
            List<Installation> filteredInstallations = installationRepository.findAll()
                    .stream()
                    .filter(installation -> installation.getDateOfRemoval()==null)
                    .collect(Collectors.toList());

            for (Installation installation : filteredInstallations) {
                String officeId = installation.getOffice().getId().getOfficeId();
                Sensor sensor = sensorRepository.findById(installation.getSensor().getId()).orElseThrow(() -> new RuntimeException("Senzor nije pronađen za ID: " + installation.getSensor().getId()));
                String sensorName= sensor.getSensorType().getName().name().toLowerCase();

                List<Threshold> thresholds = new ArrayList<>();

                //critical condition
                GreaterThreshold crit = new GreaterThreshold();
                crit.setLevel(CheckStatusLevel.CRIT);
                crit.setValue((float) sensor.getSensorType().getMaximal());
                thresholds.add(crit);

                //warn condition
                LesserThreshold warn = new LesserThreshold();
                warn.setLevel(CheckStatusLevel.WARN);
                warn.setValue((float) sensor.getSensorType().getMinimal());
                thresholds.add(warn);

                String fluxQuery =
                        "data =\n" +
                                "    from(bucket: \"airSensor-RT\")\n" +
                                "        |> range(start: -1m)\n" +
                                "        |> filter(fn: (r) => r[\"_measurement\"] == \"airSensors\")\n" +
                                "        |> filter(fn: (r) => r[\"_field\"] == \"" + sensorName + "\")\n" +
                                "        |> filter(fn: (r) => r[\"sensor_id\"] == \"" + officeId + "\")\n" +
                                "        |> aggregateWindow(every: 1m, fn: last, createEmpty: false)\n";

                ThresholdCheck thresholdCheck = new ThresholdCheck();
                DashboardQuery query= new DashboardQuery();
                query.setText(fluxQuery);
                thresholdCheck.setQuery(query);
                thresholdCheck.setOrgID("0a0a50622ace9576");
                thresholdCheck.setStatus(TaskStatusType.ACTIVE);
                thresholdCheck.setName(officeId+ ", " + sensorName);
                thresholdCheck.setEvery("1m");
                thresholdCheck.setThresholds(thresholds);
                thresholdCheck.setDescription("Current readings are out of the expected range! RUN!");

                List<Check> existingChecks = checksApi.findChecks("0a0a50622ace9576");
                ThresholdCheck existingCheck= new ThresholdCheck();
                boolean isCreated = false;
                for (Check check : existingChecks) {
                    if (check.getName().equals(officeId+ ", " + sensorName)) {
                        existingCheck= (ThresholdCheck) check;
                        isCreated=true;
                    }
                }
                if (isCreated==true) {
                    //UPDATE
                    checksApi.deleteCheck(existingCheck);
                    existingCheck.setThresholds(thresholds);
                    checksApi.createCheck(existingCheck);
                }else{
                    //CREATE
                    checksApi.createCheck(thresholdCheck);
                }
            }
    }
}
