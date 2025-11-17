import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setErrorMessage('Error fetching customers.');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteCustomer = async (customerID) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${config.apiUrl}/customers/${customerID}`);
        alert('Customer deleted successfully!');
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        const errorMessage = error.response ? error.response.data.message : error.message;
        alert(`Failed to delete customer. Error: ${errorMessage}`);
      }
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Container>
      <h1>Customer manager</h1>
      <Row className="mb-3 mt-3 justify-content-center">
        <Col xs={8} className="d-flex justify-content-center">
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            className="mr-sm-2"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col xs={2} className="d-flex justify-content-end">
          <Button href="./add-customer" className="mx-2">
            Add Customer
          </Button>
        </Col>
      </Row>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <tr key={customer.customerID}>
                <td>{customer.customerID}</td>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.contactNumber}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td className="text-align-center">
                  <Button
                    type="button"
                    href={`./edit-customer/${customer.customerID}`}
                    className="mx-2"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    className="mx-2"
                    variant="danger"
                    onClick={() => handleDeleteCustomer(customer.customerID)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>
    </Container>
  );
}

export default CustomerManager;
