import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../css/index.css'; 
import { useNavigate } from 'react-router-dom';

function VehicleCard({ name, description, imagePath, price, modelNumber, vehicleID, color, brandName, vehicleCondition, status }) {
  
  const conditionText = vehicleCondition === 0 ? "New" : vehicleCondition === 1 ? "Used" : "Certified Pre-Owned";
  const navigate = useNavigate();

  return (
    <Card className="card-custom">
      <Card.Img variant="top" src={imagePath} alt={name} className="card-img-custom" />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          <strong>Model:</strong> {modelNumber} <br />
          <strong>Price:</strong> ${price} <br />
          <strong>Color:</strong> {color} <br />
          <strong>Brand:</strong> {brandName} <br />
          <strong>Vehicle Status:</strong> {conditionText} <br />
          {description && <p>{description} km</p>}
          {status === 1 && (
            <p className="text-danger"><b>Sold</b></p>
          )}
        </Card.Text>
        
        <Button 
          variant="outline-dark" 
          onClick={() => navigate(`/vehicle/${vehicleID}`)} 
          disabled={status === 1} 
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default VehicleCard;
