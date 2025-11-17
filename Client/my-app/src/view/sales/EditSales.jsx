import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditSales() {
  const { id } = useParams();
  const [salesOrder, setSalesOrder] = useState({
    vehicleID: '',
    employeeID: '',
    customerID: '',
    quantity: '',
    orderDate: '',
    totalPrice: '',
    salesStatus: '',
  });
  const [vehicles, setVehicles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSalesOrder = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/VehicleSalesOrders/${id}`);
        setSalesOrder(response.data);
      } catch (error) {
        setErrorMessage('Error fetching sales order data.');
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

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/employees`);
        setEmployees(response.data);
      } catch (error) {
        setErrorMessage('Error fetching employees.');
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/customers`);
        setCustomers(response.data);
      } catch (error) {
        setErrorMessage('Error fetching customers.');
      }
    };

    fetchSalesOrder();
    fetchVehicles();
    fetchEmployees();
    fetchCustomers();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSalesOrder((prev) => ({ ...prev, [name]: value }));

    if (name === 'quantity') {
      const quantityValue = Number(value);
      if (quantityValue <= 0) {
        setErrorMessage('Quantity must be greater than 0.');
      } else {
        setErrorMessage(''); 
        const selectedVehicle = vehicles.find(vehicle => vehicle.vehicleID === salesOrder.vehicleID);
        if (selectedVehicle) {
          const newTotalPrice = selectedVehicle.price * quantityValue;
          setSalesOrder(prev => ({ ...prev, totalPrice: newTotalPrice }));
        }
      }
    }


    if (name === 'vehicleID') {
      const selectedVehicle = vehicles.find(vehicle => vehicle.vehicleID === value);
      if (selectedVehicle && salesOrder.quantity) {
        const newTotalPrice = selectedVehicle.price * salesOrder.quantity; 
        setSalesOrder(prev => ({ ...prev, totalPrice: newTotalPrice }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quantityValue = Number(salesOrder.quantity);
    if (quantityValue <= 0) {
      setErrorMessage('Quantity must be greater than 0.');
      return;
    }

    const salesOrderDto = {
      vehicleID: salesOrder.vehicleID,
      employeeID: salesOrder.employeeID,
      customerID: salesOrder.customerID,
      quantity: quantityValue, 
      orderDate: new Date(salesOrder.orderDate).toISOString(), 
      totalPrice: Number(salesOrder.totalPrice),
      salesStatus: Number(salesOrder.salesStatus) 
    };

    console.log('Submitting sales order:', salesOrderDto); 

    try {
      const response = await axios.put(`${config.apiUrl}/VehicleSalesOrders/${id}`, salesOrderDto);
      console.log('Sales order updated successfully:', response.data);
      alert('Sales update successful! \nPlease edit the order with the order ID you just updated');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/sales&&service-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/sales&&service-list');
      }
    } catch (error) {
        console.error(error.response); 
        setErrorMessage(`Failed to create sales order. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Edit Sales Order</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Select
                name="vehicleID"
                value={salesOrder.vehicleID}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.vehicleID} value={vehicle.vehicleID}>
                    {vehicle.name} - ({vehicle.vehicleCondition === 0 ? 'New' : 'Used'}) - Quantity: {vehicle.quantity} 
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Employee Name</Form.Label>
              <Form.Select
                name="employeeID"
                value={salesOrder.employeeID}
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
                value={salesOrder.customerID}
                onChange={handleChange}
                required
              >
                <option value="">Select Customer</option>
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
                value={salesOrder.quantity || ''}
                onChange={handleChange}
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
                value={salesOrder.orderDate ? salesOrder.orderDate.split('T')[0] : ''}
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
                value={salesOrder.totalPrice || ''}
                readOnly 
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Sales Status</Form.Label>
              <Form.Select
                name="salesStatus"
                value={salesOrder.salesStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select Sales Status</option>
                <option value="0">Pending</option>
                <option value="1">Confirmed</option>
              </Form.Select>
            </Col>
          </Row>
          <Button variant="primary" type="submit">Update Sales Order</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditSales;