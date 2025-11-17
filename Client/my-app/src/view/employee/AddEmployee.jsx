import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

function AddEmployee() {
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    dateOfJoining: ''
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.apiUrl}/employees`, newEmployee);

      console.log('Employee created successfully:', response.data);
      alert('Employee created successfully!');

      if (location.pathname.includes('/admin')) {
        navigate('/admin/customer-employee');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/customer-employee');
      }

      // Reset the form after successful addition
      setNewEmployee({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        dateOfJoining: ''
      });

      setErrorMessage('');
    } catch (error) {
      // Detailed error handling
      setErrorMessage(`Failed to create employee. ${error.response && error.response.data ? error.response.data.error : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Add New Employee</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                placeholder="First Name"
                value={newEmployee.firstName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                placeholder="Last Name"
                value={newEmployee.lastName}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                name="contactNumber"
                placeholder="Contact Number"
                value={newEmployee.contactNumber}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control
                name="dateOfJoining"
                type="date"
                value={newEmployee.dateOfJoining}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">Add Employee</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default AddEmployee;