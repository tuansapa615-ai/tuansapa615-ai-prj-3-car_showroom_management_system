import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/index.css'; 

function NavbarAdmin() {
  return (
    <>
      <Navbar expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand as={Link} to="/admin/">Showroom Management</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/admin/viewLayout">View</Nav.Link>
            <Nav.Link href="/admin/order-list">Order</Nav.Link>
            <Nav.Link href="/admin/customer-employee">Customer & Employee</Nav.Link>
            <Nav.Link href="/admin/sales&&service-list">Sales & Service</Nav.Link>
            <Nav.Link href="/admin/brand-list">Brand</Nav.Link>
            <Nav.Link href="/admin/report">Reports</Nav.Link>
            <Nav.Link href="/admin/waiting-list">WaitingList</Nav.Link>
            <Nav.Link href="/admin/viewRegistration">Registration</Nav.Link>
            <Nav.Link href="/admin/billing-list">BillingList</Nav.Link>
            <Nav.Link href="/admin/checkAdmin-User">Check</Nav.Link>

          </Nav>
          <Button as={Link} to="/" variant="outline-dark">Sign out</Button>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarAdmin;
