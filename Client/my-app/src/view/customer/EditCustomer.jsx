import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditCustomer() {
  const { id } = useParams(); 
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    address: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/customers/${id}`);
        setCustomer(response.data);
      } catch (error) {
        setErrorMessage('Error fetching customer data.');
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${config.apiUrl}/customers/${id}`, customer);
      console.log('Customer updated successfully:', response.data);
      alert('Customer updated successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/customer-employee');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/customer-employee');
      }
    } catch (error) {
      setErrorMessage(`Failed to update customer. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Edit Customer</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
            <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                placeholder="First Name"
                value={customer.firstName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
            <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                placeholder="Last Name"
                value={customer.lastName}
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
                value={customer.contactNumber}
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
                value={customer.email}
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
                value={customer.address}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">Update Customer</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditCustomer;
