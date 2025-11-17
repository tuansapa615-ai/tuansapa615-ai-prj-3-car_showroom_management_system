import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';

function BillingManager() {
  const [billings, setBillings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch the list of billings from API
  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/billing`);
        setBillings(response.data);
      } catch (error) {
        console.error('Error fetching billings:', error);
        setErrorMessage('Error fetching billings. Please try again later.');
      }
    };

    fetchBillings();
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Delete billing document
  const handleDeleteBilling = async (billingID) => {
    if (window.confirm('Are you sure you want to delete this billing document?')) {
      try {
        await axios.delete(`${config.apiUrl}/billing/${billingID}`);
        setBillings((prevBillings) => prevBillings.filter(billing => billing.billingID !== billingID));
        alert('Billing document deleted successfully!');
      } catch (error) {
        console.error('Error deleting billing:', error);
        alert(`Failed to delete billing. Error: ${error.response ? error.response.data.message : error.message}`);
      }
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Paid';
      case 1:
        return 'Unpaid';
      default:
        return 'Unknown';
    }
  };

  const filteredBillings = billings.filter(billing => {
    const { firstName, lastName } = billing.vehicleSalesOrder.customer;
    const vehicleName = billing.vehicleSalesOrder.vehicle.name;

    return (
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Container>
      <h1>Billing Manager</h1>
      <Row className="mb-3 mt-3 justify-content-center">
        <Col xs={8} className="d-flex justify-content-center">
          <Form.Control
            type="text"
            placeholder="Search by customer name or vehicle name"
            className="mr-sm-2"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col xs={2} className="d-flex justify-content-end">
          <Button href='./add-billing' className="mx-2">Add</Button>
        </Col>
      </Row>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Billing ID</th>
            <th>Customer Name</th>
            <th>Vehicle Name</th>
            <th>Total Amount</th>
            <th>Billing Date</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBillings.length > 0 ? (
            filteredBillings.map(billing => (
              <tr key={billing.billingID}>
                <td>{billing.billingID}</td>
                <td>{`${billing.vehicleSalesOrder.customer.firstName} ${billing.vehicleSalesOrder.customer.lastName}`}</td>
                <td>{billing.vehicleSalesOrder.vehicle.name}</td>
                <td>{billing.totalAmount.toFixed(2)}</td>
                <td>{new Date(billing.billingDate).toLocaleDateString()}</td>
                <td>{getPaymentStatusText(billing.paymentStatus)}</td>
                <td className='text-align-center'>
                  <Button
                    type="button"
                    href={`./edit-billing/${billing.billingID}`}
                    className="mx-2"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    className="mx-2"
                    variant="danger"
                    onClick={() => handleDeleteBilling(billing.billingID)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No billing documents found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default BillingManager;
