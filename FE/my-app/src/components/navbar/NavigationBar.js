import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import "../../index.css";
import { toast } from "react-toastify";

function getRole() {
  const roleString = sessionStorage.getItem("role");
  console.log("getRole():", roleString);
  return roleString;
}

function NavigationBar() {
  const [offices, setOffices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const expand = false;
  const userRole = getRole().substring(1, getRole().length - 1);

  useEffect(() => {
    if (isDropdownOpen) {
      fetchOffices();
    }
  }, [isDropdownOpen]);

  const fetchOffices = () => {
    const tokenString = sessionStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    fetch(`${BASE_URL}/office/get-all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken?.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setOffices(data);
      })
      .catch((error) => {
        console.error("Error while fetching offices:", error);
      });
  };

  const alertAll = () => {
    fetch(`${BASE_URL}/employee/alert-all`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Network error. Emails were not sent!");
          throw new Error("Network response was not ok");
        } else {
          toast.info("You have sent warning email to all employees!");
        }
      })
      .catch((error) => {
        console.error("Error while sending emails:", error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const LogOut = () => {
    window.location.href = "/";
    sessionStorage.setItem("token", null);
  };

  const filteredOffices = offices.filter((office) =>
    office.id.officeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
        <Container fluid>
          <Navbar.Brand href="#">Air Flow Monitor</Navbar.Brand>
          {userRole !== "USER" && (
            <Button variant="danger" className="me-auto" onClick={alertAll}>
              ALERT ALL
            </Button>
          )}
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                <Nav.Link as={Link} to="/notifications">
                  Notifications
                </Nav.Link>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavDropdown
                  title="Monitor"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  <Nav.Link as={Link} to="/">
                    Monitor Building
                  </Nav.Link>
                  <NavDropdown.Divider />
                  <NavDropdown
                    title="Monitor Office"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                    className="nav-dropdown-no-border"
                    onToggle={(isOpen) => setIsDropdownOpen(isOpen)}
                  >
                    <NavDropdown.Item>
                      <Form className="d-flex">
                        <Form.Control
                          type="search"
                          placeholder="Search"
                          className="me-2"
                          aria-label="Search"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          variant="outline-success"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Search
                        </Button>
                      </Form>
                    </NavDropdown.Item>
                    {filteredOffices.map((office) => (
                      <Link
                        to={`/monitor-room/${office.id.officeId}`}
                        key={office.id.officeId}
                        className="nav-link"
                      >
                        {office.id.officeId}
                      </Link>
                    ))}
                  </NavDropdown>
                </NavDropdown>

                {userRole === "ADMIN" && (
                  <NavDropdown
                    title="Administrate"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                    disabled={userRole.trim() !== "ADMIN"}
                  >
                    <NavDropdown
                      title="Manage Offices"
                      id={`offcanvasNavbarDropdown-expand-${expand}`}
                      className="nav-dropdown-no-border"
                    >
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/office/create">
                          Create Office
                        </Nav.Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/office/view-all">
                          View Office
                        </Nav.Link>
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown.Divider />

                    <NavDropdown
                      title="Manage Employees"
                      id={`offcanvasNavbarDropdown-expand-${expand}`}
                      className="nav-dropdown-no-border"
                    >
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/employee/create">
                          Create Employee
                        </Nav.Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/employee/view-all">
                          View Employees
                        </Nav.Link>
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown.Divider />

                    <NavDropdown
                      title="Manage Sensor Types"
                      id={`offcanvasNavbarDropdown-expand-${expand}`}
                      className="nav-dropdown-no-border"
                    >
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/sensor-type/create">
                          Create Sensor Type
                        </Nav.Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/sensor-type/view-all">
                          View Sensor Types
                        </Nav.Link>
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown.Divider />

                    <NavDropdown
                      title="Manage Installations of Sensors"
                      id={`offcanvasNavbarDropdown-expand-${expand}`}
                      className="nav-dropdown-no-border"
                    >
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/installation/create">
                          Create Installations
                        </Nav.Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/installation/view-all">
                          View Installations
                        </Nav.Link>
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown.Divider />

                    <NavDropdown
                      title="Manage Sensors"
                      id={`offcanvasNavbarDropdown-expand-${expand}`}
                      className="nav-dropdown-no-border"
                    >
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/sensor/create">
                          Create Sensor
                        </Nav.Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item className="nav-dropdown-inner">
                        <Nav.Link as={Link} to="/sensor/view-all">
                          View Sensor
                        </Nav.Link>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </NavDropdown>
                )}
                <Button variant="outline-warning" size="sm">
                  <Nav.Link className="nav-dropdown-no-border" onClick={LogOut}>
                    Log Out
                  </Nav.Link>
                </Button>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
