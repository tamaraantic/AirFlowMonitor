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
import React, { useState, useEffect } from 'react';
import AddOffice from './components/office/AddOffice';

const SOCKET_URL = 'http://localhost:8081/ws-message';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);


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
        const notification = `CheckName:${checkName}, FormattedValue: ${formattedValue}, Time: ${formattedTime}, Level: CRITICAL;`;
        setNotifications(prevNotifications => [...prevNotifications, notification]);
      }
      else if (level === 'warn') {
        toast.warn(`Dangerously high value ${formattedValue} have been recorded in ${checkName}, at ${formattedTime}!`);
      }else if (level === 'ok'){
        toast.info(`Current recorded value in ${checkName}, at ${formattedTime} is ${formattedValue}`);
      }else{
        toast.info(`Current recorded value in ${checkName}, at ${formattedTime} is ${formattedValue}`);
      }
      if (!isNotificationsVisible) {
        setIsNotificationsVisible(true);
      }
    } 
  };
  
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
          <Route path="/" element={<MonitorBuilding />} />
          <Route path="/monitor-room/:officeNumber" element={<MonitorRoom/>} />
          <Route path="/notifications" element={<Notifications notifications={notifications}/>} />
          <Route path='/office/create' element={<AddOffice/>}/>
        </Routes>
    </div>
  );
}

export default App;


