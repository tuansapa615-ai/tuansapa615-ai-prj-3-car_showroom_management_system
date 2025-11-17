import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

function AddSales() {
  const [newSale, setNewSale] = useState({
    vehicleID: '',
    employeeID: '',
    customerID: '',
    orderDate: '',
    quantity: 1, 
    salesStatus: 0,
    totalPrice: 0, 
  });

  const [vehicles, setVehicles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/vehicles`);
        const availableVehicles = response.data.filter(vehicle => vehicle.status === 0);
        setVehicles(availableVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setErrorMessage('Error fetching vehicles.');
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setErrorMessage('Error fetching employees.');
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/customers`);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setErrorMessage('Error fetching customers.');
      }
    };

    fetchVehicles();
    fetchEmployees();
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewSale((prev) => {
      const updatedSale = { ...prev, [name]: name === 'quantity' ? parseInt(value, 10) : value };

      const selectedVehicle = vehicles.find((vehicle) => vehicle.vehicleID === parseInt(updatedSale.vehicleID));

      if (selectedVehicle && updatedSale.quantity > 0) {
        updatedSale.totalPrice = selectedVehicle.price * updatedSale.quantity;
      } else {
        updatedSale.totalPrice = 0; 
      }

      return updatedSale;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newSale.quantity <= 0) {
      setErrorMessage('Quantity must be greater than 0.');
      return;
    }

    if (!newSale.orderDate) {
      setErrorMessage('Order date is required.');
      return;
    }

    try {
      const response = await axios.post(`${config.apiUrl}/VehicleSalesOrders`, newSale);
      console.log('Sales order created successfully:', response.data);
      alert('Sales order created successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/sales&&service-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/sales&&service-list');
      }
      resetForm();
    } catch (error) {
      const responseMessage = error.response?.data?.message || error.message;
      setErrorMessage(`Failed to create sales order. ${responseMessage}`);
    }
  };

  const resetForm = () => {
    setNewSale({
      vehicleID: '',
      employeeID: '',
      customerID: '',
      orderDate: '',
      quantity: 1, 
      salesStatus: 0,
      totalPrice: 0, 
    });
    setErrorMessage('');
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Add New Sales Order</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Select
                name="vehicleID"
                value={newSale.vehicleID}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option> 
                {vehicles.map(vehicle => (
                  <option key={vehicle.vehicleID} value={vehicle.vehicleID}>
                   {vehicle.modelNumber} - {vehicle.name} - ${vehicle.price} - ({vehicle.vehicleCondition === 0 ? 'New' : 'Used'}) - brand: {vehicle.brand.brandName} - Quantity: {vehicle.quantity}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Employee Name</Form.Label>
              <Form.Select
                name="employeeID"
                value={newSale.employeeID}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee</option> 
                {employees.map(employee => (
                  <option key={employee.employeeID} value={employee.employeeID}>
                    {`${employee.firstName} ${employee.lastName}`}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Customer Name</Form.Label>
              <Form.Select
                name="customerID"
                value={newSale.customerID}
                onChange={handleChange}
                required
              >
                <option value="">Select Customer</option> {/* Empty value to prompt selection */}
                {customers.map(customer => (
                  <option key={customer.customerID} value={customer.customerID}>
                    {`${customer.firstName} ${customer.lastName}`}
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
                value={newSale.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Sales Date</Form.Label>
              <Form.Control
                type="date"
                name="orderDate"
                value={newSale.orderDate}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Sales Status</Form.Label>
              <Form.Select
                name="salesStatus"
                value={newSale.salesStatus}
                onChange={handleChange}
                required
              >
                <option value={0}>Pending</option>
                {/* <option value={1}>Confirmed</option> */}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="number"
                name="totalPrice"
                value={newSale.totalPrice}
                readOnly 
              />
            </Col>
          </Row>
          <Button type="submit">Add Sales Order</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default AddSales;