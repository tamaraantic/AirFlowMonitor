import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";
import { format } from "date-fns";

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

const ViewInstallation = () => {
  const [installations, setInstallations] = useState([]);
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [isEditingInstallation, setIsEditingInstallation] = useState(false);
  const [showInstallationModal, setShowInstallationModal] = useState(false);
  const token = getToken();
  const [editedInstallation, setEditedInstallation] = useState({
    id: 0,
    dateOfInstallation: "",
    dateOfRemoval: "",
    serialNum: "",
    name: "",
    buildingId: "",
    officeId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/installation/get-all",
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
        setInstallations(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleDeleteInstallation = async (id) => {
    try {
      await fetch(`http://localhost:8081/installation/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInstallations((prevInstallations) =>
        prevInstallations.filter((installation) => installation.id !== id)
      );
      toast.success(
        "Successfully deleted installation with serial number " + id + " !"
      );
      window.location.reload();
    } catch (error) {
      toast.error(error);
      console.error("Error deleting installation:", error);
    }
  };

  const handleInputChange = (name, value) => {
    setEditedInstallation((prevInstallation) => ({
      ...prevInstallation,
      [name]: value,
    }));
  };

  const handleModalClose = () => {
    setShowInstallationModal(false);
  };

  const handleModalSave = () => {
    setShowInstallationModal(false);
    handleUpdateInstallation();
  };

  const handleEditInstallation = (installation) => {
    setIsEditingInstallation(true);
    setSelectedInstallation(installation);
    setEditedInstallation({
      id: installation.id,
      dateOfInstallation: installation.dateOfInstallation,
      dateOfRemoval: installation.dateOfRemoval,
      serialNum: installation.serialNum,
      name: installation.name,
      buildingId: installation.buildingId,
      officeId: installation.officeId,
    });
    setShowInstallationModal(true);
  };

  const handleUpdateInstallation = async () => {
    console.log(editedInstallation);
    const combinedDateTime = `${editedInstallation.dateOfInstallation}T${editedInstallation.timeOfInstallation}`;
    const dateOfRemoval = editedInstallation.dateOfRemoval;
    const parsedDateOfRemoval = new Date(dateOfRemoval);
    const formattedDateString = parsedDateOfRemoval.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    try {
      await fetch("http://localhost:8081/installation/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editedInstallation.id,
          dateOfInstallation: combinedDateTime,
          dateOfRemoval: formattedDateString,
          serialNum: editedInstallation.serialNum,
          name: editedInstallation.name,
          buildingId: editedInstallation.buildingId,
          officeId: editedInstallation.officeId,
        }),
      });

      setInstallations((prevInstallations) =>
        prevInstallations.map((installation) =>
          installation.id === selectedInstallation.id
            ? { ...installation, ...editedInstallation }
            : installation
        )
      );
      toast.success(
        "Successfully updated installation with serial number " +
          editedInstallation.id +
          " !"
      );
      setSelectedInstallation(null);
      setIsEditingInstallation(false);
      setEditedInstallation({
        id: 0,
        dateOfInstallation: "",
        dateOfRemoval: "",
        serialNum: "",
        name: "",
        buildingId: "",
        officeId: "",
      });
    } catch (error) {
      toast.error(error);
      console.error("Error updating installation:", error);
    }
  };

  function formatDateTime(dateTimeArray) {
    // Dohvati elemente datuma iz niza
    const [year, month, day, hour, minute] = dateTimeArray;

    // Kreiraj Date objekat
    const dateObject = new Date(year, month - 1, day, hour, minute);

    // Formatiraj datum u željeni oblik
    const formattedDate = dateObject.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formattedDate;
  }

  return (
    <div>
      <h2>Details about installed sensors</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date of Installation</th>
            <th>Date of Removal</th>
            <th>Serial Number</th>
            <th>Sensor Name</th>
            <th>Building ID</th>
            <th>Office ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {installations.map((installation) => (
            <tr key={installation.id}>
              <td>{formatDateTime(installation.dateOfInstallation)}</td>
              <td>
                {installation.dateOfRemoval
                  ? formatDateTime(installation.dateOfRemoval)
                  : null}
              </td>
              <td>{installation.serialNum}</td>
              <td>{installation.name}</td>
              <td>{installation.buildingId}</td>
              <td>{installation.officeId}</td>
              <td>
                <div>
                  <Button
                    variant="outline-danger"
                    className="mr-2"
                    onClick={() => handleDeleteInstallation(installation.id)}
                    disabled={installation.dateOfRemoval != null}
                  >
                    Remove Sensor
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isEditingInstallation && (
        <Modal show={showInstallationModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Installation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formId">
                    <Form.Label>ID:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedInstallation.id}
                      onChange={(e) => handleInputChange("id", e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formDateOfInstallation">
                    <Form.Label>Date of Installation:</Form.Label>
                    <Form.Control
                      type="date"
                      value={editedInstallation.dateOfInstallation}
                      onChange={(e) =>
                        handleInputChange("dateOfInstallation", e.target.value)
                      }
                    />
                    <Form.Label>Time of Installation:</Form.Label>
                    <Form.Control
                      type="time"
                      value={editedInstallation.timeOfInstallation}
                      onChange={(e) =>
                        handleInputChange("timeOfInstallation", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formDateOfRemoval">
                    <Form.Label>Date of Removal:</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={editedInstallation.dateOfRemoval}
                      onChange={(e) =>
                        handleInputChange("dateOfRemoval", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formSerialNum">
                    <Form.Label>Serial Number:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedInstallation.serialNum}
                      onChange={(e) =>
                        handleInputChange("serialNum", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formSensorName">
                    <Form.Label>Sensor Name:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedInstallation.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formBuildingId">
                    <Form.Label>Building ID:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedInstallation.buildingId}
                      onChange={(e) =>
                        handleInputChange("buildingId", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formOfficeId">
                    <Form.Label>Office ID:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedInstallation.officeId}
                      onChange={(e) =>
                        handleInputChange("officeId", e.target.value)
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

export default ViewInstallation;
