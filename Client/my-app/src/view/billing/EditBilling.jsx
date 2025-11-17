import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditBilling() {
  const { id } = useParams();
  const location = useLocation(); 
  const [billing, setBilling] = useState({
    salesOrderID: '',
    billingDate: '',
    paymentStatus: '0',
    serviceID: ''
  });
  const [salesOrders, setSalesOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch billing details
        const billingResponse = await axios.get(`${config.apiUrl}/billing/${id}`);
        setBilling(billingResponse.data);

        // Fetch sales orders and services
        const [salesOrdersResponse, servicesResponse] = await Promise.all([
          axios.get(`${config.apiUrl}/vehicleSalesOrders`),
          axios.get(`${config.apiUrl}/services`)
        ]);

        setSalesOrders(salesOrdersResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        setErrorMessage('Error fetching data. Please try again.');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBilling((prevBilling) => ({ ...prevBilling, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${config.apiUrl}/billing/${id}`, billing);
      alert('Billing document updated successfully!');

      const basePath = location.pathname.includes('/admin') ? '/admin/billing-list' : '/user/billing-list';
      navigate(basePath);
    } catch (error) {
      setErrorMessage(`Failed to update billing document. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Edit Billing Document</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Sales Order</Form.Label>
              <Form.Control
                as="select"
                name="salesOrderID"
                value={billing.salesOrderID}
                onChange={handleChange}
                required
              >
                <option value="">Select Sales Order</option>
                {salesOrders.map(order => (
                  <option key={order.salesOrderID} value={order.salesOrderID}>
                    {`Order #${order.salesOrderID} - ${order.vehicle?.name} (${order.customer?.firstName} ${order.customer?.lastName})`}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col>
              <Form.Label>Service</Form.Label>
              <Form.Control
                as="select"
                name="serviceID"
                value={billing.serviceID}
                onChange={handleChange}
                required
              >
                <option value="">Select Service</option>
                {services.map(service => (
                  <option key={service.serviceID} value={service.serviceID}>
                    {`(${service.vehicleSalesOrder?.customer?.firstName} ${service.vehicleSalesOrder?.customer?.lastName}) ${service.vehicleSalesOrder?.vehicle?.name} - $${service.cost.toFixed(2)}`}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Billing Date</Form.Label>
              <Form.Control
                name="billingDate"
                type="date"
                value={billing.billingDate.split('T')[0]}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                name="paymentStatus"
                value={billing.paymentStatus}
                onChange={handleChange}
                required
              >
                <option value="0">Paid</option>
                <option value="1">Unpaid</option>
              </Form.Control>
            </Col>
          </Row>
          <Button type="submit">Update Billing</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditBilling;
