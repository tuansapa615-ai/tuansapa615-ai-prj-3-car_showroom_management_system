import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditEmployee() {
  const { id } = useParams(); // Get `id` from URL
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    dateOfJoining: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  // Fetch current employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/employees/${id}`);
        setEmployee(response.data);
      } catch (error) {
        setErrorMessage('Error fetching employee data.');
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${config.apiUrl}/employees/${id}`, employee);
      console.log('Employee updated successfully:', response.data);
      alert('Employee updated successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/customer-employee');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/customer-employee');
      }
    } catch (error) {
      setErrorMessage(`Failed to update employee. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Edit Employee</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                placeholder="First Name"
                value={employee.firstName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                placeholder="Last Name"
                value={employee.lastName}
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
                value={employee.contactNumber}
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
                value={employee.email}
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
                value={employee.dateOfJoining}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">Update Employee</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditEmployee;