import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState({
    vehicleID: '',
    quantity: '',
    orderDate: '',
    totalPrice: '',
  });
  const [vehicles, setVehicles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/VehicleImportOrders/${id}`);
        setOrder(response.data);
      } catch (error) {
        setErrorMessage('Error fetching order data.');
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/vehicles`);
        setVehicles(response.data);
      } catch (error) {
        setErrorMessage('Error fetching vehicles.');
      }
    };

    fetchOrder();
    fetchVehicles();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${config.apiUrl}/VehicleImportOrders/${id}`, order);
      console.log('Order updated successfully:', response.data); 
      alert('Order updated successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/order-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/order-list');
      }
    } catch (error) {
      setErrorMessage(`Failed to update order. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Edit Order</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Select
                name="vehicleID" 
                value={order.vehicleID}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.vehicleID} value={vehicle.vehicleID}>
                    {vehicle.modelNumber} - {vehicle.name} - ({vehicle.vehicleCondition === 0 ? 'New' : 'Used'}) - brand: {vehicle.brand.brandName}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity" // Ensure the name matches the state property
                placeholder="Quantity"
                value={order.quantity || ''} // Ensure it's defined
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>OrderDate</Form.Label>
              <Form.Control
                type="date"
                name="orderDate" // Ensure the name matches the state property
                value={order.orderDate ? order.orderDate.split('T')[0] : ''} // Ensure it's defined
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>TotalPrice</Form.Label>
              <Form.Control
                type="number"
                name="totalPrice" // Ensure the name matches the state property
                placeholder="Total Price"
                value={order.totalPrice || ''} // Ensure it's defined
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button variant="primary" type="submit">Update Order</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditOrder;