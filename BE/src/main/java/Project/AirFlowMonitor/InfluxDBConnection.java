package Project.AirFlowMonitor;

import Project.AirFlowMonitor.model.SensorOffice;
import Project.AirFlowMonitor.repository.SensorOfficeRepository;
import com.influxdb.client.*;
import com.influxdb.client.domain.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        return InfluxDBClientFactory.create(getUrl(), getToken().toCharArray(), getOrg(), getBucket());
    }

    @Autowired
    private SensorOfficeRepository sensorOfficeRepository;

    public void createOrUpdateCheck() {
            InfluxDBClient client = buildConnection();
            QueryApi queryApi = client.getQueryApi();
            ChecksApi checksApi = client.getChecksApi();

            for (SensorOffice sensorOffice: sensorOfficeRepository.findAll()) {
                String officeId = sensorOffice.getOffice().getId().getOfficeId();
                String officeNumber= officeId.substring(officeId.length()-3);
                String sensor= sensorOffice.getSensor().getType().name().toLowerCase();

                /*if (!officeId.equals("TLM0100")){
                    continue;
                }*/

                List<Threshold> thresholds = new ArrayList<>();

                //critical condition
                GreaterThreshold crit = new GreaterThreshold();
                crit.setLevel(CheckStatusLevel.CRIT);
                crit.setValue((float) sensorOffice.getMaximal());
                thresholds.add(crit);

                //warn condition
                LesserThreshold warn = new LesserThreshold();
                warn.setLevel(CheckStatusLevel.WARN);
                warn.setValue((float) sensorOffice.getMinimal());
                thresholds.add(warn);

                String fluxQuery =
                        "data =\n" +
                                "    from(bucket: \"airSensor-RT\")\n" +
                                "        |> range(start: -1m)\n" +
                                "        |> filter(fn: (r) => r[\"_measurement\"] == \"airSensors\")\n" +
                                "        |> filter(fn: (r) => r[\"_field\"] == \"" + sensor + "\")\n" +
                                "        |> filter(fn: (r) => r[\"sensor_id\"] == \"" + officeId + "\")\n" +
                                "        |> aggregateWindow(every: 1m, fn: last, createEmpty: false)\n";

                ThresholdCheck thresholdCheck = new ThresholdCheck();
                DashboardQuery query= new DashboardQuery();
                query.setText(fluxQuery);
                thresholdCheck.setQuery(query);
                thresholdCheck.setOrgID("0a0a50622ace9576");
                thresholdCheck.setStatus(TaskStatusType.ACTIVE);
                thresholdCheck.setName(officeId+ ", " + sensor);
                thresholdCheck.setEvery("1m");
                thresholdCheck.setThresholds(thresholds);
                thresholdCheck.setDescription("Current readings are out of the expected range! RUN!");

                List<Check> existingChecks = checksApi.findChecks("0a0a50622ace9576");
                ThresholdCheck existingCheck= new ThresholdCheck();
                boolean isCreated = false;
                for (Check check : existingChecks) {
                    if (check.getName().equals(officeId+ ", " + sensor)) {
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
