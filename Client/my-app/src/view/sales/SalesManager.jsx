import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import ServicesManager from '../services/ServicesManager.jsx';

function SalesManager() {
  const [salesOrders, setSalesOrders] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [employees, setEmployees] = useState({});
  const [customers, setCustomers] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleResponse = await axios.get(`${config.apiUrl}/vehicles`);
        const vehicleData = vehicleResponse.data.reduce((acc, vehicle) => {
          acc[vehicle.vehicleID] = {
            name: vehicle.name,
            condition: vehicle.vehicleCondition
          };  
          return acc;
        }, {});
        setVehicles(vehicleData);

        const salesResponse = await axios.get(`${config.apiUrl}/VehicleSalesOrders`);
        setSalesOrders(salesResponse.data);

        const employeeResponse = await axios.get(`${config.apiUrl}/employees`);
        const employeeData = employeeResponse.data.reduce((acc, employee) => {
          acc[employee.employeeID] = `${employee.firstName} ${employee.lastName}`;
          return acc;
        }, {});
        setEmployees(employeeData);

        const customerResponse = await axios.get(`${config.apiUrl}/customers`);
        const customerData = customerResponse.data.reduce((acc, customer) => {
          acc[customer.customerID] = `${customer.firstName} ${customer.lastName}`;
          return acc;
        }, {});
        setCustomers(customerData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Error fetching data.');
      }
    };
    fetchData();
  }, []);

  const getVehicleInfo = (vehicleID) => {
    const vehicle = vehicles[vehicleID];
    if (vehicle) {
      const conditionText = vehicle.condition === 0 ? 'New' : 'Used';
      return `${vehicle.name} (${conditionText})`;
    }
    return 'Unknown Vehicle';
  };

  const getEmployeeName = (employeeID) => {
    return employees[employeeID] || 'Unknown Employee';
  };

  const getCustomerName = (customerID) => {
    return customers[customerID] || 'Unknown Customer';
  };

  const getSalesStatus = (status) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Confirmed';
      default:
        return 'Unknown Status';
    }
  };

  const sortedSalesOrders = salesOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  return (
    <Container>
      <h1>Sales Manager</h1>
      <Row className="mb-3 mt-3 justify-content-center">
        <Col className="d-flex justify-content-end">
          <Button href='./add-sales' className="mx-2">Add Sale</Button>
        </Col>
      </Row>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sales Order ID</th>
              <th>Vehicle Name</th>
              <th>Employee Name</th>
              <th>Customer Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Sales Date</th>
              <th>Sales Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSalesOrders.length > 0 ? (
              sortedSalesOrders.map(sales => (
                <tr key={sales.salesOrderID}>
                  <td>{sales.salesOrderID}</td>
                  <td>{getVehicleInfo(sales.vehicleID)}</td>
                  <td>{getEmployeeName(sales.employeeID)}</td>
                  <td>{getCustomerName(sales.customerID)}</td>
                  <td>{sales.quantity}</td>
                  <td>{sales.totalPrice}</td>
                  <td>{new Date(sales.orderDate).toLocaleDateString()}</td>
                  <td>{getSalesStatus(sales.salesStatus)}</td>
                  <td>
                    <Button
                      type="button"
                      href={`./edit-sales/${sales.salesOrderID}`}
                      className="mx-2"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No sales orders found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <ServicesManager />
    </Container>
  );
}

export default SalesManager;
