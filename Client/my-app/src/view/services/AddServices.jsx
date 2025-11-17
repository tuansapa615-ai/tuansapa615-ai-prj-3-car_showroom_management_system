import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

function AddServices() {
  const [newService, setNewService] = useState({
    salesOrderID: '',
    serviceDate: '',
    description: '',
    serviceType: '',
    cost: 0
  });
  const [salesOrders, setSalesOrders] = useState([]);
  const [existingServices, setExistingServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all sales orders
        const salesOrdersResponse = await axios.get(`${config.apiUrl}/VehicleSalesOrders`);
        setSalesOrders(salesOrdersResponse.data);

        // Fetch existing services to filter out used salesOrderID
        const servicesResponse = await axios.get(`${config.apiUrl}/services`);
        setExistingServices(servicesResponse.data);

      } catch (error) {
        setErrorMessage('Error fetching sales orders or services.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.apiUrl}/services`, newService);
      console.log('Service added successfully:', response.data);
      alert('Service added successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/sales&&service-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/sales&&service-list');
      }

      setNewService({
        salesOrderID: '',
        serviceDate: '',
        description: '',
        serviceType: '',
        cost: 0
      });

      setErrorMessage('');
    } catch (error) {
      setErrorMessage(`Failed to add service. ${error.response && error.response.data ? error.response.data.message : error.message}`);
    }
  };

  // Filter out sales orders that already have a service
  const filteredSalesOrders = salesOrders.filter(
    (order) => !existingServices.some((service) => service.salesOrderID === order.salesOrderID)
  );

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Add New Service</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Sales Order</Form.Label>
              <Form.Control
                as="select"
                name="salesOrderID"
                value={newService.salesOrderID}
                onChange={handleChange}
                required
              >
                <option value="">Select Sales Order</option>
                {filteredSalesOrders.map((order) => (
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
                value={newService.serviceDate}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                type="text"
                value={newService.description}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Service Type</Form.Label>
              <Form.Control
                name="serviceType"
                type="text"
                value={newService.serviceType}
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
                value={newService.cost}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">Add Service</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default AddServices;
