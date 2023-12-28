import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "../../index.css";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  console.log("getToken():", tokenString);
  const userToken = JSON.parse(tokenString);
  console.log("Bearer ", userToken?.token);
  return userToken?.token;
}

const CreateOffice = () => {
  // State za praćenje unesenih podataka
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [capacity, setCapacity] = useState("");
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8081/building/get-all",
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
        setBuildingOptions(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Podaci:", { name, area, capacity });

    try {
      const response = await fetch("http://localhost:8081/office/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: { buildingId: selectedBuilding, officeId: name },
          surface: area,
          capacity: capacity,
        }),
      });

      if (!response.ok) {
        toast.error("Network error. Office was not created!");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      toast.success("Office is created!");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data:", error);
    }
  };

  return (
    <div className="office-form-container">
      <h2>Create new office</h2>
      <Form className="custom-form" onSubmit={handleSubmit}>
        <Form.Group>
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
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formArea">
          <Form.Label>Area</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCapacity">
          <Form.Label>Capacity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
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

export default CreateOffice;
