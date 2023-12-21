import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import '../../index.css';

function MonitorRoom() {
  const { officeNumber } = useParams();

  const grafanaDashboardURL = "http://localhost:3000/d-solo/3225UmGIz/dinamic-dashboard?orgId=1";
  const temperatureParams= "&var-sensor=temperature&var-office=" + officeNumber;
  const coParams= "&var-sensor=co&var-office=" + officeNumber;
  const humidityParams= "&var-sensor=humidity&var-office=" + officeNumber;
  const time = "&refresh=5s&theme=light&panelId=2";
  const tmpURL= grafanaDashboardURL + temperatureParams + time;
  const coURL= grafanaDashboardURL + coParams + time;
  const humidityURL= grafanaDashboardURL + humidityParams + time;

  return (
  <div class="monitor-container">
    <h2>{`Monitor Office ${officeNumber}`}</h2>
    <div class="iframe-container">
      <iframe
        src={tmpURL}
        class="dashboard-iframe"
        title="Dashboard temperature"
      ></iframe>
      <iframe
        src={coURL}
        class="dashboard-iframe"
        title="Dashboard humidity"
      ></iframe>
      <iframe
        src={humidityURL}
        class="dashboard-iframe"
        title="Dashboard co"
      ></iframe>
    </div>
  </div>
  );
}

export default MonitorRoom;
