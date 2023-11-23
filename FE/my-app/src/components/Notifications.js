import React, { useState } from 'react';
import SockJsClient from 'react-stomp';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';


const SOCKET_URL = 'http://localhost:8081/ws-message';

const Notifications = () => {
  const [messages, setMessages] = useState([]);

  let onConnected = () => {
    console.log("Connected!!");
  }

  let onMessageReceived = (msg) => {
    setMessages(prevMessages => [...prevMessages, msg.message]);
    toast.info(`Nova poruka: ${msg.message}`)
  }

  /*let onMessageReceived = (msg) => {
    setMessages(prevMessages => [...prevMessages, msg.message]);
  
    const regex = /checkName=(\w+), temperature, time=(.*), level=(\w+), value=(\d+\.\d+)/;
    const match = msg.message.match(regex);
  
    if (match) {
      const [, checkName, time, level, value] = match;
  
      if (level === 'crit') {
        toast.error(`Nova poruka: checkName=${checkName}, time=${time}, level=${level}, value=${value}`);
      }
      else if (level === 'warn') {
        toast.warn(`Nova poruka: checkName=${checkName}, time=${time}, level=${level}, value=${value}`);
      }else if (level === 'ok'){
        toast.info(`Nova poruka: checkName=${checkName}, time=${time}, level=${level}, value=${value}`);
      }else{
        toast.info(`Nova poruka: ${msg.message}`);
      }
      
    } else {
      console.error('Poruka nije u očekivanom formatu:', msg.message);
    }
  }*/

  return (
    <div>
      <h2>Welcome to Monitoring Sistem!</h2>
      <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/message']}
        onConnect={onConnected}
        onMessage={msg => onMessageReceived(msg)}
        debug={false}
      />
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
