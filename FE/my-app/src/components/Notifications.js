import React, { useState } from 'react';
import SockJsClient from 'react-stomp';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useToast } from '../ToastProvider';


const SOCKET_URL = 'http://localhost:8081/ws-message';

const Notifications = () => {
  const [messages, setMessages] = useState([]);
  

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
      const parsedMessage = `CheckName:${checkName}, FormattedValue: ${formattedValue}, Time: ${formattedTime}, Level: ${level}`;
  
      setMessages(prevMessages => [...prevMessages, parsedMessage]);

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
    } else {
      setMessages(prevMessages => [...prevMessages, msg.message]);
    }
  };

  return (
    <div>
      <h2><b>Welcome to Monitoring Sistem!</b></h2>
      <h3><i>NOTIFICATIONS:</i></h3>

  <div className="container mt-5">
    <table className="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Office</th>
        <th>Value</th>
        <th>Time</th>
        <th>Level</th>
      </tr>
    </thead>
    <tbody>
      {messages.map((message, index) => {
        const regex = /CheckName:(.*?), FormattedValue: (.*?), Time: (.*?), Level: (.*)/;
        const match = message.match(regex);

        if (match) {
          const [, checkName, formattedValue, time, level] = match;
          return (
            <tr key={index} className="message-row">
              <td className="message-data">{checkName}</td>
              <td className="message-data">{formattedValue}</td>
              <td className="message-data">{time}</td>
              <td className="message-data">{level}</td>
            </tr>
          );
        } else {
          return null;
        }
      })}
    </tbody>
  </table>
</div>

    </div>
  );
}

export default Notifications;
