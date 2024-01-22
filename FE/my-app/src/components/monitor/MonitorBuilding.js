import React, { useState, useEffect } from "react";
import "../../index.css";
import { toast } from "react-toastify";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

function MonitorBuilding() {
  const [installations, setInstallations] = useState([]);
  const [coInstallations, setCoInstallations] = useState([]);
  const [tmpInstallations, setTmpInstallations] = useState([]);
  const [humInstallations, setHumInstallations] = useState([]);
  const [sensorTypes, setSensorTypes] = useState("");
  const [offices, setOffices] = useState("");
  const grafanaDashboardURL =
    "http://localhost:3000/d-solo/m08H4XOSz/airflowmonitor-dinamicdashboard?orgId=1&theme=light&panelId=2";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/installation/get-all",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const filteredInstallations = result.filter(
          (installation) => installation.dateOfRemoval === null
        );
        setInstallations(filteredInstallations);
        // Filtriranje i kopiranje objekata s name === "TEMPERATURE"
        const tmpInstallations = filteredInstallations.filter(
          (installation) => installation.name === "TEMPERATURE"
        );

        // Filtriranje i kopiranje objekata s name === "HUMIDITY"
        const humInstallations = filteredInstallations.filter(
          (installation) => installation.name === "HUMIDITY"
        );

        // Filtriranje i kopiranje objekata s name === "CO"
        const coInstallations = filteredInstallations.filter(
          (installation) => installation.name === "CO"
        );

        // Postavljanje rezultata u odgovarajuće stanje (npr. state varijable)
        setCoInstallations(coInstallations);
        setTmpInstallations(tmpInstallations);
        setHumInstallations(humInstallations);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getToken()]);

  function customUrl(sensor) {
    var url = "";
    url = grafanaDashboardURL;
    if (sensor === "temperature") {
      url = url + "&var-sensorTypes=temperature";
      tmpInstallations.forEach((installation) => {
        if (installation.officeId) {
          url += `&var-offices=${installation.officeId}`;
        }
      });
    } else if (sensor === "co") {
      url = url + "&var-sensorTypes=co";
      coInstallations.forEach((installation) => {
        if (installation.officeId) {
          url += `&var-offices=${installation.officeId}`;
        }
      });
    } else if (sensor === "humidity") {
      url = url + "&var-sensorTypes=humidity";
      humInstallations.forEach((installation) => {
        if (installation.officeId) {
          url += `&var-offices=${installation.officeId}`;
        }
      });
    }
    console.log("URL: ", url);
    return url;
  }

  return (
    <div>
      <h2>Monitor Building</h2>
      <div>
        {tmpInstallations.length > 0 ? (
          <iframe
            src={customUrl("temperature")}
            className="dashboard-iframe"
            title="Dashboard temperature"
          ></iframe>
        ) : (
          <p>No temperature sensors have been installed in the building.</p>
        )}
        {coInstallations.length > 0 ? (
          <iframe
            src={customUrl("co")}
            className="dashboard-iframe"
            title="Dashboard co"
          ></iframe>
        ) : (
          <p>No co sensors have been installed in the building.</p>
        )}
        {humInstallations.length > 0 ? (
          <iframe
            src={customUrl("humidity")}
            className="dashboard-iframe"
            title="Dashboard humidity"
          ></iframe>
        ) : (
          <p>No humidity sensors have been installed in the building.</p>
        )}
      </div>
    </div>
  );
}

export default MonitorBuilding;
