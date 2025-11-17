import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditServices() {
  const { id } = useParams(); // Get `id` from URL (ServiceID)
  const [service, setService] = useState({
    salesOrderID: '',
    serviceDate: '',
    description: '',
    cost: '',
    serviceType: ''
  });
  const [salesOrders, setSalesOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceResponse = await axios.get(`${config.apiUrl}/services/${id}`);
        setService(serviceResponse.data);

        const salesOrdersResponse = await axios.get(`${config.apiUrl}/VehicleSalesOrders`);
        setSalesOrders(salesOrdersResponse.data);
      } catch (error) {
        setErrorMessage('Error fetching data.');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Service Data:", service); 

    try {
      await axios.put(`${config.apiUrl}/services/${id}`, service);
      alert(`Service ID: ${id} updated successfully!`);
      if (location.pathname.includes('/admin')) {
        navigate('/admin/sales&&service-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/sales&&service-list');
      }
    } catch (error) {
      console.error('Error response:', error.response?.data); 
      setErrorMessage(`Failed to update service. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Edit Service</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Sales Order ID</Form.Label>
              <Form.Control
                as="select"
                name="salesOrderID"
                value={service.salesOrderID}
                onChange={handleChange}
                required
              >
                <option value="">Select Sales Order</option>
                {salesOrders.map(order => (
                  <option key={order.salesOrderID} value={order.salesOrderID}>
                    {order.salesOrderID} - {order.customer.firstName} {order.customer.lastName} - Date: {new Date(order.orderDate).toLocaleDateString()} - {order.vehicle.name}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Service Date</Form.Label>
              <Form.Control
                name="serviceDate"
                type="date"
                value={service.serviceDate ? new Date(service.serviceDate).toISOString().substr(0, 10) : ''}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                type="text"
                value={service.description}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Cost</Form.Label>
              <Form.Control
                name="cost"
                type="number"
                step="0.01"
                value={service.cost}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Service Type</Form.Label>
              <Form.Control
                name="serviceType"
                type="text"
                value={service.serviceType}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">Update Service</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditServices;
