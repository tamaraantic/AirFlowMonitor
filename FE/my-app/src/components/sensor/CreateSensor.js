import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

const CreateSensor = ({ onSubmit }) => {
  const [sensorSerialNum, setSensorSerialNum] = useState("");
  const [sensorOptions, setSensorOptions] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("");

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/sensor-type/get-all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setSensorOptions(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSensorData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8081/sensor/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            serialNum: sensorSerialNum,
            name: selectedSensor,
          }),
        }
      );
      if (!response.ok) {
        toast.error("Network error. Installation was not created!");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success("Installation is created!");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data:", error);
    }
  };

  return (
    <div className="sensor-form-container">
      <h2>Create new sensor</h2>
      <Form className="custom-form" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Select Sensor Type</Form.Label>
          <Form.Select
            className="select-light"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            required
          >
            <option value="">Select Sensor Type</option>
            {sensorOptions.map((sensor) => (
              <option key={sensor.name} value={sensor.name}>
                {sensor.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formSensorSerialNum">
          <Form.Label>Sensor Serial Number:</Form.Label>
          <Form.Control
            type="text"
            value={sensorSerialNum}
            onChange={(e) => setSensorSerialNum(e.target.value)}
            required
          />
        </Form.Group>

        <div className="submit-button-container">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateSensor;
