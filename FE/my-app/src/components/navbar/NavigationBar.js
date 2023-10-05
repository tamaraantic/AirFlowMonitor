import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import '../../index.css';

function NavigationBar() {
  const expand = false;

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
                    title="Monitor Room"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                    className="nav-dropdown-no-border"
                  >
                    <NavDropdown.Item >
                      <Form className="d-flex">
                        <Form.Control
                          type="search"
                          placeholder="Search"
                          className="me-2"
                          aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                      </Form>
                    </NavDropdown.Item>
                    <NavDropdown.Item className="nav-dropdown-inner">
                      100
                    </NavDropdown.Item>
                    <NavDropdown.Item className="nav-dropdown-inner">
                      101
                    </NavDropdown.Item>
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