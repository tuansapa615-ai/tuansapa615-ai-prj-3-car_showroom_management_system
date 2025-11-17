import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../css/index.css'; 
import Footer from './Footer';
import config from '../config';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/vehicles/${id}`)
      .then(response => {
        setVehicle(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the vehicle data!", error);
      });
  }, [id]);

  if (!vehicle) {
    return <p>Loading...</p>;
  }

  const conditionText = vehicle.vehicleCondition === 0 ? "New" : vehicle.vehicleCondition === 1 ? "Used" : "Certified Pre-Owned";

  return (
    <Container className="vehicle-details-container">
      <Row className="vehicle-details-row">
        {/* Hình ảnh xe */}
        <Col md={6}>
          <Card.Img variant="top" src={`${config.Url}${vehicle.imagePath}`} className="vehicle-image" />
        </Col>
        
        {/* Thông tin chi tiết */}
        <Col md={6} className="vehicle-info">
          <h1>{vehicle.name}</h1>
          <Card.Text className="details-text">
            <strong>Description:</strong> {`Engine: ${vehicle.engineType}, Mileage: ${vehicle.mileage}`}<br />
            <strong>Price:</strong> <span className="price">${vehicle.price}</span><br />
            <strong>Brand:</strong> {vehicle.brand ? vehicle.brand.brandName : "Unknown"}<br />
            <strong>Model Number:</strong> {vehicle.modelNumber}<br />
            <strong>Color:</strong> {vehicle.color}<br />
            <strong>Vehicle Manufacture Date:</strong> {new Date(vehicle.manufactureDate).toLocaleDateString()}<br />
            <strong>Quantity:</strong> {vehicle.quantity}<br />
            <strong>Vehicle condition:</strong> {conditionText}<br />
            <strong>Status:</strong> 
            <span className={vehicle.status === 0 ? 'status text-success' : 'status text-danger'}>
              {vehicle.status === 0 ? 'In Stock' : vehicle.status === 1 ? 'Sold' : 'Unknown'}
            </span>
          </Card.Text>
          
          {/* Nút quay lại */}
          <div className="back-button">
            <Button variant="outline-dark" onClick={() => window.history.back()}>
              Back
            </Button>
          </div>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default VehicleDetails;
