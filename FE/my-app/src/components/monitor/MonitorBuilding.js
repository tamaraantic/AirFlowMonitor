import React from 'react';
import '../../index.css';

function MonitorBuilding() {
  return (
<div>
  <h2>Monitor Building</h2>
  <div className="grid-container" name="main">
    <div className="grid-item"><iframe src="http://localhost:3000/d-solo/-JAqAciSk/air-sensor-dashboard?orgId=1&refresh=5s&theme=light&panelId=2" frameBorder="0" width="100%" height="100%"></iframe></div>
    <div className="grid-item"><iframe src="http://localhost:3000/d-solo/yZCk1wmIk/temperature-dashboard?orgId=1&refresh=5s&theme=light&panelId=2" width="100%" height="100%" frameBorder="0"></iframe></div>
    <div className="grid-item"><iframe src="http://localhost:3000/d-solo/dJfnowiSk/co-dashboard?orgId=1&theme=light&panelId=2" width="100%" height="100%" frameBorder="0"></iframe></div>
    <div className="grid-item"><iframe src="http://localhost:3000/d-solo/NZnYTQiSz/humidity-dashboard?orgId=1&theme=light&panelId=2" width="100%" height="100%" frameBorder="0"></iframe></div>
  </div>
</div>
  );
}

export default MonitorBuilding;
