import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditWaitingList() {
  const { id } = useParams(); 
  const [waitingList, setWaitingList] = useState({
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
        const response = await axios.get(`${config.apiUrl}/waitinglist/${id}`);
        setWaitingList(response.data);

        const customersResponse = await axios.get(`${config.apiUrl}/customers`);
        const vehiclesResponse = await axios.get(`${config.apiUrl}/vehicles`);
        setCustomers(customersResponse.data);
        setVehicles(vehiclesResponse.data);
      } catch (error) {
        setErrorMessage('Error fetching data.');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWaitingList({ ...waitingList, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${config.apiUrl}/waitinglist/${id}`, waitingList);
      alert('Waiting list request updated successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/waiting-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/waiting-list');
      }
    } catch (error) {
      setErrorMessage(`Failed to update waiting list request. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Edit Waiting List Request</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Customer</Form.Label>
              <Form.Control
                as="select"
                name="customerID"
                value={waitingList.customerID}
                onChange={handleChange}
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.customerID} value={customer.customerID}>
                    {`${customer.firstName} ${customer.lastName}`}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col>
              <Form.Label>Vehicle</Form.Label>
              <Form.Control
                as="select"
                name="vehicleID"
                value={waitingList.vehicleID}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
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
                value={waitingList.requestDate.split('T')[0]} // Ensure date format
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">Update Request</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditWaitingList;
