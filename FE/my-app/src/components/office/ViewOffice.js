import React, { useState, useEffect } from "react";
import { Table, Button, Form, Row, Col, Modal } from "react-bootstrap";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  console.log("getToken():", tokenString);
  const userToken = JSON.parse(tokenString);
  console.log("Bearer ", userToken?.token);
  return userToken?.token;
}

const ViewOffice = () => {
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const token = getToken();
  const [editedOffice, setEditedOffice] = useState({
    officeId: "",
    buildingId: "",
    surface: "",
    capacity: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8081/office/get-all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("result:", result);
        setOffices(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteOffice = async (id) => {
    console.log(offices);
    try {
      await fetch(
        `http://localhost:8081/office/delete/${id.buildingId}/${id.officeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOffices((prevOffices) =>
        prevOffices.filter((office) => office.id !== id)
      );
      toast.success("Succesfuly deleted office " + id.officeId + " !");
    } catch (error) {
      toast.error(error);
      console.error("Error deleting office:", error);
    }
  };

  const handleUpdateOffice = async () => {
    try {
      await fetch(`http://localhost:8081/office/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedOffice),
      });

      setOffices((prevOffices) =>
        prevOffices.map((office) =>
          office.id.officeId === selectedOffice.id.officeId &&
          office.id.buildingId === selectedOffice.id.buildingId
            ? { ...office, ...editedOffice }
            : office
        )
      );
      toast.success(
        "Succesfuly updated office " + editedOffice.id.officeId + " !"
      );
      setSelectedOffice(null);
      setIsEditing(false);
      setEditedOffice({
        officeId: "",
        buildingId: "",
        surface: "",
        capacity: "",
      });
    } catch (error) {
      toast.error(error);
      console.error("Error updating office:", error);
    }
  };

  const handleInputChange = (name, value) => {
    setEditedOffice((prevOffice) => ({ ...prevOffice, [name]: value }));
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    setShowModal(false);
    handleUpdateOffice();
  };

  const handleEditOffice = (office) => {
    setIsEditing(true);
    setSelectedOffice(office);
    setEditedOffice({
      id: { buildingId: office.id.buildingId, officeId: office.id.officeId },
      surface: office.surface,
      capacity: office.capacity,
    });
    setShowModal(true);
  };

  return (
    <div>
      <h2>Details about Offices</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Office name</th>
            <th>Building Id</th>
            <th>Surface</th>
            <th>Capacity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {offices.map((office) => (
            <tr key={office.id.officeId}>
              <td>{office.id.officeId}</td>
              <td>{office.id.buildingId}</td>
              <td>{office.surface}</td>
              <td>{office.capacity}</td>
              <td>
                <div>
                  <Button
                    variant="outline-danger"
                    className="mr-2"
                    onClick={() => handleDeleteOffice(office.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="mr-2"
                    onClick={() => handleEditOffice(office)}
                  >
                    Update
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isEditing && (
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Office</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formOfficeID">
                    <Form.Label>Office name:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedOffice.id.officeId}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formBuildingID">
                    <Form.Label>Building Id:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedOffice.id.buildingId}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formSurface">
                    <Form.Label>Surface (square meters):</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={editedOffice.surface}
                      value={editedOffice.surface}
                      onChange={(e) =>
                        handleInputChange("surface", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCapacity">
                    <Form.Label>Capacity:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={editedOffice.capacity}
                      value={editedOffice.capacity}
                      onChange={(e) =>
                        handleInputChange("capacity", e.target.value)
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

export default ViewOffice;
