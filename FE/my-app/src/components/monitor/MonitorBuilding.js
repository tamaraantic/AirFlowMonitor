import React from 'react';
import '../../index.css';

function MonitorBuilding() {
  return (
<div>
  <h2>Monitor Building</h2>
  <div class="grid-container" name="main">
    <div class="grid-item"><iframe src="http://localhost:3000/d-solo/-JAqAciSk/air-sensor-dashboard?orgId=1&refresh=5s&theme=light&panelId=2" frameborder="0" width="100%" height="100%"></iframe></div>
    <div class="grid-item"><iframe src="http://localhost:3000/d-solo/yZCk1wmIk/temperature-dashboard?orgId=1&refresh=5s&theme=light&panelId=2" width="100%" height="100%" frameborder="0"></iframe></div>
    <div class="grid-item"><iframe src="http://localhost:3000/d-solo/dJfnowiSk/co-dashboard?orgId=1&theme=light&panelId=2" width="100%" height="100%" frameborder="0"></iframe></div>
    <div class="grid-item"><iframe src="http://localhost:3000/d-solo/NZnYTQiSz/humidity-dashboard?orgId=1&theme=light&panelId=2" width="100%" height="100%" frameborder="0"></iframe></div>
  </div>
</div>
  );
}

export default MonitorBuilding;
