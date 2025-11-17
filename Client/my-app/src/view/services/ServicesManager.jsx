import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';

function ServicesManager() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [salesOrders, setSalesOrders] = useState([]);

  // Fetch services and sales orders from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const salesOrdersResponse = await axios.get(`${config.apiUrl}/VehicleSalesOrders`);
        setSalesOrders(salesOrdersResponse.data);
        const response = await axios.get(`${config.apiUrl}/services`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        setErrorMessage('Error fetching services. Please try again later.');
      }
    };

    fetchServices();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteService = async (serviceID) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`${config.apiUrl}/services/${serviceID}`);
        setServices(services.filter(service => service.serviceID !== serviceID));
        alert('Service deleted successfully!');
      } catch (error) {
        console.error('Error deleting service:', error);
        const message = error.response ? error.response.data.message : 'Failed to delete service. Please try again.';
        alert(message);
      }
    }
  };

  const filteredServices = services
    .filter(service => 
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate)); // Sorting by serviceDate in descending order

  return (
    <Container>
      <h1>Services manager</h1>
      <Row className="mb-3 mt-3 justify-content-center">
        <Col xs={8} className="d-flex justify-content-center">
          <Form.Control
            type="text"
            placeholder="Search by description or service type"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col xs={2} className="d-flex justify-content-end">
          <Button href='./add-service' className="mx-2">Add Service</Button>
        </Col>
      </Row>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Service ID</th>
            <th>Sales Order ID</th>
            <th>Description</th>
            <th>Service Type</th>
            <th>Cost</th>
            <th>Service Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length > 0 ? (
            filteredServices.map(service => {
              const salesOrder = salesOrders.find(order => order.salesOrderID === service.salesOrderID);
              const customerInfo = salesOrder 
                ? `${salesOrder.salesOrderID} - ${salesOrder.customer.firstName} ${salesOrder.customer.lastName} - Date: ${new Date(salesOrder.orderDate).toLocaleDateString()} - Vehicle: ${salesOrder.vehicle?.name || 'N/A'}`
                : 'N/A';

              return (
                <tr key={service.serviceID}>
                  <td>{service.serviceID}</td>
                  <td>{customerInfo}</td>
                  <td>{service.description}</td>
                  <td>{service.serviceType}</td>
                  <td>{service.cost.toFixed(2)}</td>
                  <td>{new Date(service.serviceDate).toLocaleDateString()}</td>
                  <td className='text-align-center'>
                    <Button
                      type="button"
                      href={`./edit-service/${service.serviceID}`}
                      className="mx-2"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      className="mx-2"
                      variant="danger"
                      onClick={() => handleDeleteService(service.serviceID)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No services found.</td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>
    </Container>
  );
}

export default ServicesManager;
