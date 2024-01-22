import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

const ViewSensor = () => {
  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isEditingSensor, setIsEditingSensor] = useState(false);
  const [showSensorModal, setShowSensorModal] = useState(false);
  const token = getToken();
  const [editedSensor, setEditedSensor] = useState({
    name: "",
    serialNum: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/sensor/get-all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setSensors(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);
 

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Sensor Name</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor) => (
            <tr key={sensor.serialNum}>
              <td>{sensor.serialNum}</td>
              <td>{sensor.name}</td>
              <td>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ViewSensor;
