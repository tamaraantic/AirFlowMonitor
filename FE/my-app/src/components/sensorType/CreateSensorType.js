import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

const CreateSensorType = () => {
  // State za praćenje unesenih podataka
  const [name, setName] = useState("");
  const [minimal, setMinimal] = useState("");
  const [maximal, setMaximal] = useState("");
  const [optimal, setOptimal] = useState("");
  const token = getToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Podaci:", { name, minimal, maximal, optimal });

    try {
      const response = await fetch("http://localhost:8081/sensor-type/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          minimal,
          maximal,
          optimal,
        }),
      });

      if (!response.ok) {
        toast.error("Network error. Sensor type was not created!");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      toast.success("Sensor type is created!");
    } catch (error) {
      console.error("Error creating sensor type:", error);
      toast.error("Error creating sensor type:", error);
    }
  };

  return (
    <div className="sensor-type-form-container">
      <h2>Create new sensor type</h2>
      <Form className="custom-form" onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Select
            className="select-light"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value="">Select Sensor Type</option>
            <option value="0">Temperature</option>
            <option value="1">CO (Carbon Monoxide)</option>
            <option value="2">Humidity</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formMinimal">
          <Form.Label>Minimal</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter minimal value"
            value={minimal}
            onChange={(e) => setMinimal(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formMaximal">
          <Form.Label>Maximal</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter maximal value"
            value={maximal}
            onChange={(e) => setMaximal(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formOptimal">
          <Form.Label>Optimal</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter optimal value"
            value={optimal}
            onChange={(e) => setOptimal(e.target.value)}
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

export default CreateSensorType;
