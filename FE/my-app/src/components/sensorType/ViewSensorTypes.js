import React, { useState, useEffect } from "react";
import { Table, Button, Form, Row, Col, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

const ViewSensorTypes = () => {
  const [sensorTypes, setSensorTypes] = useState([]);
  const [selectedSensorType, setSelectedSensorType] = useState(null);
  const [isEditingSensorType, setIsEditingSensorType] = useState(false);
  const [showSensorTypeModal, setShowSensorTypeModal] = useState(false);
  const token = getToken();
  const [editedSensorType, setEditedSensorType] = useState({
    id: "",
    name: "",
    minimal: "",
    maximal: "",
    optimal: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/sensor-type/get-all",
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
        setSensorTypes(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleDeleteSensorType = async (id) => {
    try {
      await fetch(`http://localhost:8081/sensor-type/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSensorTypes((prevSensorTypes) =>
        prevSensorTypes.filter((sensorType) => sensorType.id !== id)
      );
      toast.success("Successfully deleted sensor type with ID " + id + " !");
    } catch (error) {
      toast.error(error);
      console.error("Error deleting sensor type:", error);
    }
  };

  const handleUpdateSensorType = async () => {
    try {
      await fetch(`http://localhost:8081/sensor-type/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedSensorType),
      });

      setSensorTypes((prevSensorTypes) =>
        prevSensorTypes.map((sensorType) =>
          sensorType.id === selectedSensorType.id
            ? { ...sensorType, ...editedSensorType }
            : sensorType
        )
      );
      toast.success(
        "Successfully updated sensor type with ID " + editedSensorType.id + " !"
      );
      setSelectedSensorType(null);
      setIsEditingSensorType(false);
      setEditedSensorType({
        id: "",
        name: "",
        minimal: "",
        maximal: "",
        optimal: "",
      });
      //INFLUX CHECK UPDATE
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
      toast.error(error);
      console.error("Error updating sensor type:", error);
    }
  };

  const handleInputChange = (name, value) => {
    setEditedSensorType((prevSensorType) => ({
      ...prevSensorType,
      [name]: value,
    }));
  };

  const handleModalClose = () => {
    setShowSensorTypeModal(false);
  };

  const handleModalSave = () => {
    setShowSensorTypeModal(false);
    handleUpdateSensorType();
  };

  const handleEditSensorType = (sensorType) => {
    setIsEditingSensorType(true);
    setSelectedSensorType(sensorType);
    setEditedSensorType({
      id: sensorType.id,
      name: sensorType.name,
      minimal: sensorType.minimal,
      maximal: sensorType.maximal,
      optimal: sensorType.optimal,
    });
    setShowSensorTypeModal(true);
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Minimal</th>
            <th>Maximal</th>
            <th>Optimal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sensorTypes.map((sensorType) => (
            <tr key={sensorType.id}>
              <td>{sensorType.id}</td>
              <td>{sensorType.name}</td>
              <td>{sensorType.minimal}</td>
              <td>{sensorType.maximal}</td>
              <td>{sensorType.optimal}</td>
              <td>
                <div>
                  <Button
                    variant="outline-danger"
                    className="mr-2"
                    onClick={() => handleDeleteSensorType(sensorType.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="mr-2"
                    onClick={() => handleEditSensorType(sensorType)}
                  >
                    Update
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isEditingSensorType && (
        <Modal show={showSensorTypeModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Sensor Type</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formSensorTypeID">
                    <Form.Label>ID:</Form.Label>
                    <Form.Control type="text" value={editedSensorType.id} />
                  </Form.Group>

                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Select
                      className="select-light"
                      placeholder={editedSensorType.name}
                      value={editedSensorType.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    >
                      <option value="">Select Sensor Type</option>
                      <option value="0">Temperature</option>
                      <option value="1">CO (Carbon Monoxide)</option>
                      <option value="2">Humidity</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formSensorTypeMinimal">
                    <Form.Label>Minimal:</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder={editedSensorType.minimal}
                      value={editedSensorType.minimal}
                      onChange={(e) =>
                        handleInputChange("minimal", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formSensorTypeMaximal">
                    <Form.Label>Maximal:</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder={editedSensorType.maximal}
                      value={editedSensorType.maximal}
                      onChange={(e) =>
                        handleInputChange("maximal", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formSensorTypeOptimal">
                    <Form.Label>Optimal:</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder={editedSensorType.optimal}
                      value={editedSensorType.optimal}
                      onChange={(e) =>
                        handleInputChange("optimal", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleModalSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewSensorTypes;
