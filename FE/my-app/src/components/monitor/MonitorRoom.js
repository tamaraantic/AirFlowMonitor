import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import '../../index.css';

function MonitorRoom() {
  const { officeNumber } = useParams();
  const [selectedSensor, setSelectedSensor] = useState("temperature");

  const handleSensorChange = (e) => {
    setSelectedSensor(e.target.value); // Ažurirajte odabranu opciju kad se promijeni
  };

  const grafanaDashboardURL = "http://localhost:3000/d-solo/3225UmGIz/dinamic-dashboard?orgId=1";
  const queryParams = "&var-sensor=" + selectedSensor + "&var-office=" + officeNumber;
  const time = "&refresh=5s&theme=light&panelId=2";
  const finalURL = grafanaDashboardURL + queryParams + time;

  return (
    <div>
      <h2>{`Monitor Office ${officeNumber}`}</h2>

      <div className="choose-sensor-div">
      <div className="row">
        <div className="col">
          <label>Choose sensor:</label>
        </div>
        <select className="col"
          id="sensorSelect"
          value={selectedSensor}
          onChange={handleSensorChange}
        >
          <option value="">Select...</option>
          <option value="co">CO</option>
          <option value="humidity">Humidity</option>
          <option value="temperature">Temperature</option>
      </select>
      </div>
      </div>

      <iframe
        src= {finalURL}
        width="90%"
        height="300px%"
        title="Dashboard"
      ></iframe>
      
    </div>
  );
}

export default MonitorRoom;
