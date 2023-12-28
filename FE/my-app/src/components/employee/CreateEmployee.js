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

const CreateEmployee = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [officeOptions, setOfficeOptions] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [password, setPassword] = useState("");
  const token = getToken();

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/building/get-all`, {
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
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
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
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname: name,
          lastname: surname,
          email,
          password,
          role,
          officeId: { buildingId: selectedBuilding, officeId: selectedOffice },
        }),
      });

      if (!response.ok) {
        toast.error("Network error. Employee was not created!");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      toast.success("Employee is created!");
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Error creating employee:", error);
    }
  };

  return (
    <div className="office-form-container">
      <h2>Register new employee</h2>
      <Form className="custom-form" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Building</Form.Label>
          <Form.Select
            className="select-light"
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
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
          >
            <option value="">Select Office</option>
            {officeOptions.map((office) => (
              <option key={office.id.officeId} value={office.id.officeId}>
                {office.id.officeId}
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
          />
        </Form.Group>

        <Form.Group controlId="formSurname">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Employee Role</Form.Label>
          <Form.Select
            className="select-light"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SECURITY">SECURITY WORKER</option>
            <option value="USER">USER</option>
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

export default CreateEmployee;
