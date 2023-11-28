import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/navbar/NavigationBar';
import { Route, Routes } from 'react-router-dom';
import MonitorBuilding from './components/monitor/MonitorBuilding';
import MonitorRoom from './components/monitor/MonitorRoom';
import Notifications from './components/Notifications';
import { toast } from 'react-toastify';
import SockJsClient from 'react-stomp';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';

const SOCKET_URL = 'http://localhost:8081/ws-message';

let onConnected = () => {
  console.log("Connected!!");
}

let onMessageReceived = (msg) => {
  const regex = /checkName=(\w+), temperature, time=(.*), level=(\w+), value=(\d+\.\d+)/;
  const match = msg.message.match(regex);

  if (match) {
    const [, checkName, time, level, rawValue] = match;
    const formattedValue = Number(rawValue).toFixed(2); 
    const timeInCET = new Date(time); 
    const options = { timeZone: 'Europe/Belgrade', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedTime = timeInCET.toLocaleString('en-US', options); 

    if (level === 'crit') {
      toast.error(`Dangerously high value ${formattedValue} have been recorded in ${checkName}, at ${formattedTime}!`);
    
    }
    else if (level === 'warn') {
      toast.warn(`Dangerously high value ${formattedValue} have been recorded in ${checkName}, at ${formattedTime}!`);
    }else if (level === 'ok'){
      toast.info(`Current recorded value in ${checkName}, at ${formattedTime} is ${formattedValue}`);
    }else{
      toast.info(`Current recorded value in ${checkName}, at ${formattedTime} is ${formattedValue}`);
    }
  } 
};

function App() {
  
  return (
    <div className="App">
      <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/message']}
        onConnect={onConnected}
        onMessage={msg => onMessageReceived(msg)}
        debug={false}
      />
        <NavigationBar />
        <Routes>
          <Route path="/air-sensor" element={<MonitorBuilding />} />
          <Route path="/monitor-room/:officeNumber" element={<MonitorRoom/>} />
          <Route path="/" element={<Notifications />} />
        </Routes>
    </div>
  );
}

export default App;


