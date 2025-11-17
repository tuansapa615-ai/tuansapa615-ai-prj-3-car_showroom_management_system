import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

function AddBilling() {
  const [salesOrders, setSalesOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [billingEntries, setBillingEntries] = useState([]); // State to hold existing billing entries
  const [salesOrderID, setSalesOrderID] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('0');
  const [serviceID, setServiceID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSalesOrdersAndServices = async () => {
      try {
        const [salesOrdersResponse, servicesResponse, billingResponse] = await Promise.all([
          axios.get(`${config.apiUrl}/vehicleSalesOrders`),
          axios.get(`${config.apiUrl}/services`),
          axios.get(`${config.apiUrl}/billing`), // Assuming there's an endpoint to get billing entries
        ]);
        setSalesOrders(salesOrdersResponse.data);
        setServices(servicesResponse.data);
        setBillingEntries(billingResponse.data); // Set existing billing entries
      } catch (error) {
        setErrorMessage('Error fetching sales orders or services.');
      }
    };
    fetchSalesOrdersAndServices();
  }, []);

  const handleAddBilling = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!salesOrderID || !billingDate || !serviceID) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    try {
      const newBilling = {
        salesOrderID: parseInt(salesOrderID),
        billingDate,
        paymentStatus: parseInt(paymentStatus),
        serviceID: parseInt(serviceID),
      };

      await axios.post(`${config.apiUrl}/billing`, newBilling);
      setSuccessMessage('Billing document created successfully!');

      if (location.pathname.includes('/admin')) {
        navigate('/admin/billing-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/billing-list');
      }

    } catch (error) {
      const message = error.response ? error.response.data.message : error.message;
      setErrorMessage(`Failed to create billing document. Error: ${message}`);
    }
  };

  const existingSalesOrderIDs = billingEntries.map(billing => billing.salesOrderID);
  const existingServiceIDs = billingEntries.map(billing => billing.serviceID);

  const filteredSalesOrders = salesOrders.filter(order => !existingSalesOrderIDs.includes(order.salesOrderID));
  const filteredServices = services.filter(service => !existingServiceIDs.includes(service.serviceID));

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mt-3">Add Billing Document</h2>
          <Form onSubmit={handleAddBilling}>
            <Form.Group controlId="salesOrderID">
              <Form.Label>Sales Order</Form.Label>
              <Form.Control
                as="select"
                value={salesOrderID}
                onChange={(e) => setSalesOrderID(e.target.value)}
                required
              >
                <option value="">Select a Sales Order</option>
                {filteredSalesOrders.map((order) => (
                  <option key={order.salesOrderID} value={order.salesOrderID}>
                    {`Order #${order.salesOrderID} - ${order.vehicle.name} (${order.customer.firstName} ${order.customer.lastName})`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="billingDate">
              <Form.Label>Billing Date</Form.Label>
              <Form.Control
                type="date"
                value={billingDate}
                onChange={(e) => setBillingDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="paymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                required
              >
                <option value="0">Paid</option>
                <option value="1">Unpaid</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="serviceID">
              <Form.Label>Service</Form.Label>
              <Form.Control
                as="select"
                value={serviceID}
                onChange={(e) => setServiceID(e.target.value)}
                required
              >
                <option value="">Select a Service</option>
                {filteredServices.map((service) => (
                  <option key={service.serviceID} value={service.serviceID}>
                    {`(${service.vehicleSalesOrder?.customer?.firstName} ${service.vehicleSalesOrder?.customer?.lastName}) ${service.vehicleSalesOrder?.vehicle?.name} - $${service.cost.toFixed(2)}`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <Button variant="primary" type="submit" className="mt-3">
              Add Billing
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AddBilling;
