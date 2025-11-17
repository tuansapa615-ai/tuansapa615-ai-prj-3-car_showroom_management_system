import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

function AddOrder() {
  const [newOrder, setNewOrder] = useState({
    vehicleID: '',
    orderDate: '',
    quantity: 0,
    totalPrice: 0,
  });

  const [vehicles, setVehicles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/vehicles`);
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setErrorMessage('Error fetching vehicles.');
      }
    };

    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.apiUrl}/VehicleImportOrders`, newOrder);
      console.log('Order created successfully:', response.data);
      alert('Order created successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/order-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/order-list');
      }
      resetForm();
    } catch (error) {
      setErrorMessage(`Failed to create order. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const resetForm = () => {
    setNewOrder({
      vehicleID: '',
      orderDate: '',
      quantity: 0,
      totalPrice: 0,
    });
    setErrorMessage('');
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Add New Order</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Select
                name="vehicleID"
                value={newOrder.vehicleID}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.vehicleID} value={vehicle.vehicleID}>
                    {vehicle.modelNumber} - {vehicle.name} - ({vehicle.vehicleCondition === 0 ? 'New' : 'Used'}) - brand: {vehicle.brand.brandName} - Price: {vehicle.price}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newOrder.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Order Date</Form.Label>
              <Form.Control
                type="date"
                name="orderDate"
                value={newOrder.orderDate}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="number"
                name="totalPrice"
                placeholder="Total Price"
                value={newOrder.totalPrice}
                onChange={handleChange}
                min="0"
                required
              />
            </Col>
          </Row>
          <Button type="submit">Add Order</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default AddOrder;