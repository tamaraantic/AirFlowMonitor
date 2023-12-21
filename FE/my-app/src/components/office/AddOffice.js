import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../../index.css';

const AddOffice = () => {
  // State za praćenje unesenih podataka
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [capacity, setCapacity] = useState('');
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  // Funkcija za submit forme
  const handleSubmit = (e) => {
    e.preventDefault();

    // Ovdje možete izvršiti željenu logiku sa unesenim podacima (npr. slanje na server)
    console.log('Podaci:', { name, area, capacity });
  };

  return (
    <div className="office-form-container">
        <h2>Create new office</h2>
      <Form className="custom-form" onSubmit={handleSubmit}>
        <Form.Group>
        <Form.Select
            className='select-light'
            value={selectedBuilding}
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
            <Form.Label >Name</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </Form.Group>

        <Form.Group controlId="formArea">
            <Form.Label>Area</Form.Label>
            <Form.Control
            type="number"
            placeholder="Enter area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
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

export default AddOffice;
