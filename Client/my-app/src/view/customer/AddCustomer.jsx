import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

function AddCustomer() {
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    address: ''
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Xử lý khi người dùng nhập dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.apiUrl}/customers`, newCustomer);

      console.log('Customer created successfully:', response.data);
      alert('Customer created successfully!');

      if (location.pathname.includes('/admin')) {
        navigate('/admin/customer-employee');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/customer-employee');
      }
      setNewCustomer({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        address: ''
      });

      setErrorMessage('');
    } catch (error) {
      setErrorMessage(`Failed to create customer. ${error.response && error.response.data ? error.response.data.error : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Add New Customer</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                placeholder="First Name"
                value={newCustomer.firstName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                placeholder="Last Name"
                value={newCustomer.lastName}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Form.Label>Contact Number</Form.Label>
            <Col>
              <Form.Control
                name="contactNumber"
                placeholder="Contact Number"
                value={newCustomer.contactNumber}
                onChange={handleChange}
                required
              />
            </Col>
            <Form.Label>Email</Form.Label>
            <Col>
              <Form.Control
                name="email"
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                placeholder="Address"
                value={newCustomer.address}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">Add Customer</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default AddCustomer;
