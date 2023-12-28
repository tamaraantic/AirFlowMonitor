import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./components/navbar/NavigationBar";
import { Route, Routes } from "react-router-dom";
import MonitorBuilding from "./components/monitor/MonitorBuilding";
import MonitorRoom from "./components/monitor/MonitorRoom";
import Notifications from "./components/Notifications";
import { toast } from "react-toastify";
import SockJsClient from "react-stomp";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import CreateOffice from "./components/office/CreateOffice";
import Login from "./components/Login";
import ViewOffice from "./components/office/ViewOffice";
import CreateEmployee from "./components/employee/CreateEmployee";
import ViewEmployees from "./components/employee/ViewEmployees";
import ViewSensorTypes from "./components/sensorType/ViewSensorTypes";
import CreateSensorType from "./components/sensorType/CreateSensorType";
import ViewInstallation from "./components/installation/ViewInstallations";
import CreateInstallation from "./components/installation/CreateInstallation"

const SOCKET_URL = "http://localhost:8081/ws-message";

function setToken(userToken) {
  console.log("tokan koji je dosao u app:", userToken);
  sessionStorage.setItem("token", JSON.stringify(userToken));
  window.location.reload();
}

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  console.log("getToken():", tokenString);
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

function App() {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const token = getToken();

  let onConnected = () => {
    console.log("Connected!!");
  };

  let onMessageReceived = (msg) => {
    const regex =
      /checkName=(\w+), temperature, time=(.*), level=(\w+), value=(\d+\.\d+)/;
    const match = msg.message.match(regex);

    if (match) {
      const [, checkName, time, level, rawValue] = match;
      const formattedValue = Number(rawValue).toFixed(2);
      const timeInCET = new Date(time);
      const options = {
        timeZone: "Europe/Belgrade",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formattedTime = timeInCET.toLocaleString("en-US", options);

      if (level === "crit") {
        toast.error(
          `Dangerously high value ${formattedValue} have been recorded in ${checkName}, at ${formattedTime}!`
        );
        const notification = `CheckName:${checkName}, FormattedValue: ${formattedValue}, Time: ${formattedTime}, Level: CRITICAL;`;
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ]);
      } else if (level === "warn") {
        toast.warn(
          `Dangerously high value ${formattedValue} have been recorded in ${checkName}, at ${formattedTime}!`
        );
      } else if (level === "ok") {
        toast.info(
          `Current recorded value in ${checkName}, at ${formattedTime} is ${formattedValue}`
        );
      } else {
        toast.info(
          `Current recorded value in ${checkName}, at ${formattedTime} is ${formattedValue}`
        );
      }
      if (!isNotificationsVisible) {
        setIsNotificationsVisible(true);
      }
    }
  };

  if (!token) {
    return <Login setToken={setToken} />;
  } else {
    return (
      <div className="App">
        <SockJsClient
          url={SOCKET_URL}
          topics={["/topic/message"]}
          onConnect={onConnected}
          onMessage={(msg) => onMessageReceived(msg)}
          debug={false}
        />
        <NavigationBar />
        <Routes>
          <Route path="/" element={<MonitorBuilding />} />
          <Route path="/monitor-room/:officeNumber" element={<MonitorRoom />} />
          <Route
            path="/notifications"
            element={<Notifications notifications={notifications} />}
          />
          <Route path="/office/create" element={<CreateOffice />} />
          <Route path="/office/view-all" element={<ViewOffice />} />
          <Route path="/employee/create" element={<CreateEmployee />} />
          <Route path="/employee/view-all" element={<ViewEmployees />} />
          <Route path="/sensor-type/view-all" element={<ViewSensorTypes />} />
          <Route path="/sensor-type/create" element={<CreateSensorType />} />
          <Route path="/installation/view-all" element={<ViewInstallation />} />
          <Route path="/installation/create" element={<CreateInstallation />} />
        </Routes>
      </div>
    );
  }
}

export default App;
