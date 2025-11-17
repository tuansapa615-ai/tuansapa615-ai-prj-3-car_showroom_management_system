import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import '../css/index.css'

function NavbarUser() {
  return (
    <>
      <Navbar expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="/user/#home"><h1>User manager</h1></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/user/order-list">Order</Nav.Link>
            <Nav.Link href="/user/customer">Customer</Nav.Link>
            <Nav.Link href="/user/sales&&service-list">Sales && Service</Nav.Link>
            <Nav.Link href="/user/brand-list">Brand</Nav.Link>
            <Nav.Link href="/user/waiting-list">WaitingList</Nav.Link>
            <Nav.Link href="/user/viewRegistration">Registration</Nav.Link>

            <Nav.Link href="/user/billing-list">BillingList</Nav.Link>
          </Nav>
          <Button as={Link} to="/" variant="outline-dark">Sign out</Button>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarUser;

