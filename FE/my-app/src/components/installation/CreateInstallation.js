import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "../../index.css";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

const CreateInstallation = () => {
  const [dateOfInstallation, setDateOfInstallation] = useState("");
  const [timeOfInstallation, setTimeOfInstallation] = useState("");
  const [dateOfRemoval, setDateOfRemoval] = useState("");
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [officeOptions, setOfficeOptions] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [sensorOptions, setSensorOptions] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [officeId, setOfficeId] = useState("");
  const token = getToken();

  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        const response = await fetch("http://localhost:8081/building/get-all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setBuildingOptions(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBuildingData();
  }, []);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:8081/sensor/get-all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/office/get-all/${selectedBuilding}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setOfficeOptions(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching offices:", error);
      }
    };

    if (selectedBuilding) {
      fetchOffices();
    }
  }, [selectedBuilding]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedDateTime = `${dateOfInstallation}T${timeOfInstallation}`;

    try {
      const response = await fetch(
        "http://localhost:8081/installation/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dateOfInstallation: combinedDateTime,
            dateOfRemoval,
            serialNum: selectedSensor,
            name: selectedSensor.name,
            buildingId: selectedBuilding,
            officeId: selectedOffice,
          }),
        }
      );

      if (!response.ok) {
        toast.error("Network error. Installation was not created!");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success("Installation is created!");

      try {
        const checkResponse = await fetch(
          "http://localhost:8081/building/create-check",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!checkResponse.ok) {
          toast.error("Network error. Check request failed!");
          throw new Error(`HTTP error! Status: ${checkResponse.status}`);
        }

        // Dodatna logika za rukovanje uspješnim odgovorom na GET zahtjev
        console.log("Building create-check successful:", checkResponse);
      } catch (checkError) {
        console.error("Error checking building:", checkError);
        toast.error("Error checking building:", checkError);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data:", error);
    }
  };

  return (
    <div className="office-form-container">
      <h2>Create new installation</h2>
      <Form className="custom-form" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Building</Form.Label>
          <Form.Select
            className="select-light"
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            required
          >
            <option value="">Select Building</option>
            {buildingOptions.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Office</Form.Label>
          <Form.Select
            className="select-light"
            value={selectedOffice}
            onChange={(e) => setSelectedOffice(e.target.value)}
            required
          >
            <option value="">Select Office</option>
            {officeOptions.map((office) => (
              <option key={office.id.officeId} value={office.id.officeId}>
                {office.id.officeId}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formDateOfInstallation">
          <Form.Label>Date of Installation:</Form.Label>
          <Form.Control
            type="date"
            value={dateOfInstallation}
            onChange={(e) => setDateOfInstallation(e.target.value)}
            required
          />
          <Form.Label>Time of Installation:</Form.Label>
          <Form.Control
            type="time"
            value={timeOfInstallation}
            onChange={(e) => setTimeOfInstallation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Select Sensor</Form.Label>
          <Form.Select
            className="select-light"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            required
          >
            <option value="">Select Sensor</option>
            {sensorOptions.map((sensor) => (
              <option key={sensor.serialNum} value={sensor.serialNum}>
                {sensor.serialNum + " " + sensor.name}
              </option>
            ))}
          </Form.Select>
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

export default CreateInstallation;
