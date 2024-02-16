import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

const Notifications = (props) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (props.notifications) {
      // Sortiranje poruka po vremenu
      const sortedMessages = props.notifications
        .slice() // Kopiranje niza kako bismo izbjegli mijenjanje originalnog niza
        .sort((a, b) => {
          const timeA = getTimeFromNotification(a);
          const timeB = getTimeFromNotification(b);
          return new Date(timeB) - new Date(timeA);
        })
        .reverse();

      // Postavljanje ažuriranih poruka u lokalnu varijablu
      setMessages(sortedMessages);
    }
  }, [props.notifications]);

  // Ova varijabla će sadržavati ažurirane poruke
  const updatedMessages = messages;

  const getTimeFromNotification = (notification) => {
    const timeRegex = /Time:\s+(\d{2}:\d{2}:\d{2})/;
    const match = timeRegex.exec(notification);
    const time = match ? match[1] : "";

    return time;
  };

  return (
    <div>
      <h2>
        <b>Welcome to Monitoring Sistem!</b>
      </h2>
      <h3>
        <i>Notifications:</i>
      </h3>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Office name</th>
            <th>Measured value</th>
            <th>Sensor type</th>
            <th>Time of measurement</th>
            <th>Level of emergency</th>
          </tr>
        </thead>
        <tbody>
          {updatedMessages.map((message, index) => {
            const messageString =
              typeof message === "string" && message.endsWith(";")
                ? message
                : message.toString();

            const parts = messageString.split(",").map((part) => part.trim());
            const checkName =
              parts
                .find((part) => part.includes("CheckName"))
                ?.split(":")[1]
                ?.trim() || "";
            const formattedValue =
              parts
                .find((part) => part.includes("FormattedValue"))
                ?.split(":")[1]
                ?.trim() || "";
            const timeIndex = parts.findIndex((part) => part.includes("Time"));
            const time =
              timeIndex !== -1
                ? parts[timeIndex]
                    .substring(parts[timeIndex].indexOf(":") + 1)
                    .trim()
                : "";
            const level = (
              parts
                .find((part) => part.includes("Level"))
                ?.split(":")[1]
                ?.trim() || ""
            ).replace(/;$/, "");

            if (checkName && formattedValue && time && level) {
              return (
                <tr key={index}>
                  <td>{checkName}</td>
                  <td>{formattedValue}</td>
                  <td>Temperature</td>
                  <td>{time}</td>
                  <td>{level}</td>
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;
