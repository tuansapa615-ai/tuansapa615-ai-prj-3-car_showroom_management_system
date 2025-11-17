import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Alert, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';

function OrderManager() {
  const [importOrders, setImportOrders] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [brands, setBrands] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [conditionFilter, setConditionFilter] = useState(''); 
  const [brandFilter, setBrandFilter] = useState(''); 
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    const fetchVehiclesAndOrders = async () => {
      try {
        const vehicleResponse = await axios.get(`${config.apiUrl}/vehicles`);
        const vehicleData = vehicleResponse.data.reduce((acc, vehicle) => {
          acc[vehicle.vehicleID] = {
            name: vehicle.name,
            modelNumber : vehicle.modelNumber,
            brandID: vehicle.brandID,
            brandName: vehicle.brand.brandName,
            condition: vehicle.vehicleCondition 
          };
          return acc;
        }, {});
        setVehicles(vehicleData);

        const orderResponse = await axios.get(`${config.apiUrl}/VehicleImportOrders`);
        setImportOrders(orderResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Error fetching data.');
      }
    };

    const fetchBrands = async () => {
      try {
        const brandResponse = await axios.get(`${config.apiUrl}/brands`);
        setBrands(brandResponse.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchVehiclesAndOrders();
    fetchBrands();
  }, []);

  const getVehicleInfo = (vehicleID) => {
    const vehicle = vehicles[vehicleID];
    if (vehicle) {
      const conditionText = vehicle.condition === 0 ? 'New' : 'Used';
      return `${vehicle.modelNumber} - ${vehicle.name} - ${vehicle.brandName  } (${conditionText})`;
    }
    return 'Unknown Vehicle';
  };

  const getBrandName = (brandID) => {
    const brand = brands.find(b => b.brandID === brandID);
    return brand ? brand.brandName : 'Unknown Brand';
  };

  const filteredOrders = importOrders.filter(order => {
    const vehicle = vehicles[order.vehicleID] || {};
    const matchesCondition = conditionFilter ? (vehicle.condition === (conditionFilter === 'New' ? 0 : 1)) : true;
    const matchesBrand = brandFilter ? vehicle.brandID === parseInt(brandFilter) : true;
    const matchesSearchTerm = vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCondition && matchesBrand && matchesSearchTerm;
  });

  return (
    <Container>
      <h1>Order Manager</h1>
      <Row className="mb-3 mt-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Filter by Condition</Form.Label>
            <Form.Control
              as="select"
              value={conditionFilter}
              onChange={e => setConditionFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Filter by Brand</Form.Label>
            <Form.Select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand.brandID} value={brand.brandID}>
                  {brand.brandName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Search by Vehicle Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter vehicle name"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col className="d-flex align-items-end justify-content-end">
          <Button href="./add-order" className="mx-2">Add</Button>
        </Col>
      </Row>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Vehicle Info</th>
            <th>Order Date</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Brand</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <tr key={order.purchaseOrderID}>
                <td>{order.purchaseOrderID}</td>
                <td>{getVehicleInfo(order.vehicleID)}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{order.quantity}</td>
                <td>{order.totalPrice}</td>
                <td>{getBrandName(vehicles[order.vehicleID]?.brandID)}</td>
                <td>
                  <Button
                    type="button"
                    href={`./edit-order/${order.purchaseOrderID}`} 
                    className="mx-2"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No import orders found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default OrderManager;
