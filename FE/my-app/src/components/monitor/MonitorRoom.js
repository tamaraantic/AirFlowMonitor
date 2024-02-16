import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../../index.css";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

function MonitorRoom() {
  const { officeNumber } = useParams();
  const [tmpInstalationTime, setTmpInstallationTime] = useState("");
  const [coInstalationTime, setCoInstallationTime] = useState("");
  const [humInstalationTime, setHumInstallationTime] = useState("");
  const grafanaDashboardURL =
    "http://localhost:3000/d-solo/3225UmGIz/dinamic-dashboard?orgId=1";
  const temperatureParams =
    "&var-sensor=temperature&var-office=" + officeNumber;
  const coParams = "&var-sensor=co&var-office=" + officeNumber;
  const humidityParams = "&var-sensor=humidity&var-office=" + officeNumber;
  const time = `&refresh=5s&theme=light&panelId=2`;
  const tmpURL =
    grafanaDashboardURL +
    temperatureParams +
    time +
    `&from=now-${tmpInstalationTime}s&to=now`;
  const coURL =
    grafanaDashboardURL +
    coParams +
    time +
    `&from=now-${coInstalationTime}s&to=now`;
  const humidityURL =
    grafanaDashboardURL +
    humidityParams +
    time +
    `&from=now-${humInstalationTime}s&to=now`;
  const token = getToken();

  useEffect(() => {
    const fetchTmpInstallation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/installation/find-by/1/${officeNumber}/TEMPERATURE`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        if (result >= 3600) {
          setTmpInstallationTime(3600);
        } else {
          setTmpInstallationTime(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTmpInstallation();
  }, []);

  useEffect(() => {
    const fetchCoInstallation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/installation/find-by/1/${officeNumber}/CO`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setCoInstallationTime(result);
        console.log(result);
        if (result >= 3600) {
          setCoInstallationTime(3600);
        } else {
          setCoInstallationTime(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCoInstallation();
  }, []);

  useEffect(() => {
    const fetchHumnstallation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/installation/find-by/1/${officeNumber}/HUMIDITY`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setHumInstallationTime(result);
        console.log(result);
        if (result >= 3600) {
          setHumInstallationTime(3600);
        } else {
          setHumInstallationTime(result);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchHumnstallation();
  }, []);

  return (
    <div class="monitor-container">
      <h2>{`Monitor Office ${officeNumber}`}</h2>
      <div class="iframe-container">
        {tmpInstalationTime !== 0 ? (
          <iframe
            src={tmpURL}
            className="dashboard-iframe"
            title="Dashboard temperature"
          ></iframe>
        ) : (
          <h5><i>Sensor for temperature was not installed in this office.</i></h5>
        )}
        {coInstalationTime !== 0 ? (
          <iframe
            src={coURL}
            class="dashboard-iframe"
            title="Dashboard humidity"
          ></iframe>
        ) : (
          <h5><i>Sensor for carbon monoxide was not installed in this office.</i></h5>
        )}
        {humInstalationTime !== 0 ? (
          <iframe
            src={humidityURL}
            class="dashboard-iframe"
            title="Dashboard co"
          ></iframe>
        ) : (
          <h5><i>Sensor for humidity was not installed in this office.</i></h5>
        )}
      </div>
    </div>
  );
}

export default MonitorRoom;
