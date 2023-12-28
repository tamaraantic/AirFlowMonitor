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

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const token = getToken();
  const [editedEmployee, setEditedEmployee] = useState({
    email: "",
    firstname: "",
    lastname: "",
    role: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/employee/get-all-by-building_id/1",
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
        console.log("result:", result);
        setEmployees(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteEmployee = async (email) => {
    try {
      await fetch(`http://localhost:8081/employee/delete/${email}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.email !== email)
      );
      toast.success("Successfully deleted employee " + email + " !");
    } catch (error) {
      toast.error(error);
      console.error("Error deleting employee:", error);
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      await fetch(`http://localhost:8081/employee/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedEmployee),
      });

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.email === selectedEmployee.email
            ? { ...employee, ...editedEmployee }
            : employee
        )
      );
      toast.success(
        "Successfully updated employee " + editedEmployee.id.employeeId + " !"
      );
      setSelectedEmployee(null);
      setIsEditingEmployee(false);
      setEditedEmployee({
        email: "",
        firstname: "",
        lastname: "",
        role: "",
      });
      
    } catch (error) {
      toast.error(error);
      console.error("Error updating employee:", error);
    }
  };

  const handleInputChange = (name, value) => {
    setEditedEmployee((prevEmployee) => ({ ...prevEmployee, [name]: value }));
  };

  const handleModalClose = () => {
    setShowEmployeeModal(false);
  };

  const handleModalSave = () => {
    setShowEmployeeModal(false);
    handleUpdateEmployee();
  };

  const handleEditEmployee = (employee) => {
    setIsEditingEmployee(true);
    setSelectedEmployee(employee);
    setEditedEmployee({
      email: employee.email,
      role: employee.role,
      firstname: employee.firstname,
      lastname: employee.lastname,
    });
    setShowEmployeeModal(true);
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Role</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.email}>
              <td>{employee.role}</td>
              <td>{employee.email}</td>
              <td>{employee.name}</td>
              <td>{employee.surname}</td>
              <td>
                <div>
                  <Button
                    variant="outline-danger"
                    className="mr-2"
                    onClick={() => handleDeleteEmployee(employee.email)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="mr-2"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    Update
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isEditingEmployee && (
        <Modal show={showEmployeeModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formEmployeeID">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="text" value={editedEmployee.email} />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Employee Role</Form.Label>
                    <Form.Select
                      className="select-light"
                      value={editedEmployee.role}
                    >
                      <option value="">Select Role</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SECURITY">SECURITY WORKER</option>
                      <option value="USER">USER</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formFirstName">
                    <Form.Label>First Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={editedEmployee.firstname}
                      value={editedEmployee.firstname}
                      onChange={(e) =>
                        handleInputChange("firstname", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formLastName">
                    <Form.Label>Last Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={editedEmployee.lastname}
                      value={editedEmployee.lastname}
                      onChange={(e) =>
                        handleInputChange("lastname", e.target.value)
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

export default ViewEmployees;
