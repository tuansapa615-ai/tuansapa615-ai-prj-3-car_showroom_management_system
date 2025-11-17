import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from './logoCar.png';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/index.css';

const NavbarCustomer = ({ setSelectedVehicleCondition }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleProductClick = (condition) => {
    setSelectedVehicleCondition(condition);
    navigate('/'); // Redirect to homepage
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img src={logo} alt="Logo" />
          <h2 className="mb-0">Showroom Car</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="PRODUCT" href="/" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => handleProductClick(0)}>New</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleProductClick(1)}>Used</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleProductClick(null)}>All</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/about-us">ABOUT US</Nav.Link>
            <Nav.Link href="/contact">CONTACT</Nav.Link>
          </Nav>

          <Row className="justify-content-end">
            <Col xs="auto">
              <Button className='btn-navbar' href="/login" variant="outline-dark">Login</Button>
            </Col>
          </Row>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarCustomer;
