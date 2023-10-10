import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL from '../../apiConfig'; 
import '../../index.css';

function NavigationBar() {
  const [offices, setOffices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const expand = false;

  useEffect(() => {
    if (isDropdownOpen) {
      fetchOffices();
    }
  }, [isDropdownOpen]);

  const fetchOffices = () => {
    fetch(`${BASE_URL}/office/get-all`, {
      method: 'GET', 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setOffices(data);
      })
      .catch((error) => {
        console.error('Error while fetching offices:', error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOffices = offices.filter((office) =>
  office.id.officeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
        <Container fluid >
          <Navbar.Brand href="#">Air Flow Monitor</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Air Flow Monitor
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavDropdown
                  title="Monitor"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  <Nav.Link as={Link} to="/air-sensor">Monitor Building</Nav.Link>
                  <NavDropdown.Divider />
                  <NavDropdown
                    title="Monitor Office"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                    className="nav-dropdown-no-border"
                    onToggle={(isOpen) => setIsDropdownOpen(isOpen)}
                  >
                    <NavDropdown.Item >
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
                <NavDropdown
                  title="Administrate"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  <NavDropdown
                    title="Manage Offices"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                    className="nav-dropdown-no-border"
                  >
                    <NavDropdown.Item className="nav-dropdown-inner">
                      Add Office
                    </NavDropdown.Item>
                    <NavDropdown.Item className="nav-dropdown-inner">
                      Remove Office
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown.Divider />
                  <NavDropdown
                    title="Manage Employees"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                    className="nav-dropdown-no-border"
                  >
                    <NavDropdown.Item className="nav-dropdown-inner">
                      Add Employee
                    </NavDropdown.Item>
                    <NavDropdown.Item className="nav-dropdown-inner">
                      Remove Employee
                    </NavDropdown.Item>
                    <NavDropdown.Item className="nav-dropdown-inner">
                      Move Employee
                    </NavDropdown.Item>
                  </NavDropdown>
                </NavDropdown>
              </Nav>
              
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}


export default NavigationBar;