import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

function AddWaitingList() {
  const [newRequest, setNewRequest] = useState({
    customerID: '',
    vehicleID: '',
    requestDate: ''
  });
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get(`${config.apiUrl}/customers`);
        setCustomers(customersResponse.data);
        const vehiclesResponse = await axios.get(`${config.apiUrl}/vehicles`);
        setVehicles(vehiclesResponse.data);
      } catch (error) {
        setErrorMessage('Error fetching customers or vehicles.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post(`${config.apiUrl}/waitinglist`, newRequest);
      console.log('Request added successfully:', response.data);
      alert('Waiting list request added successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/waiting-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/waiting-list');
      }
      setNewRequest({
        customerID: '',
        vehicleID: '',
        requestDate: ''
      });
    } catch (error) {
      setErrorMessage(`Failed to add request. ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Add New Waiting List Request</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Customer</Form.Label>
              <Form.Control
                as="select"
                name="customerID"
                value={newRequest.customerID}
                onChange={handleChange}
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.customerID} value={customer.customerID}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col>
              <Form.Label>Vehicle</Form.Label>
              <Form.Control
                as="select"
                name="vehicleID"
                value={newRequest.vehicleID}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.vehicleID} value={vehicle.vehicleID}>
                    {vehicle.modelNumber} - {vehicle.name} - {vehicle.brand.brandName}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Request Date</Form.Label>
              <Form.Control
                name="requestDate"
                type="date"
                value={newRequest.requestDate}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">
            Add Request
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default AddWaitingList;