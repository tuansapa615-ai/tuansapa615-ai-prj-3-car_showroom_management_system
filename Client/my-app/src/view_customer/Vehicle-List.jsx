import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import VehicleCard from './Card.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination'; 
import config from '../config.js';

const VehicleList = ({ selectedVehicleCondition }) => {
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const vehiclesPerPage = 8; 

  useEffect(() => {
    axios.get('https://localhost:7008/api/vehicles')
      .then(response => {
        setVehicles(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the vehicle data!", error);
      });

    axios.get('https://localhost:7008/api/brands')
      .then(response => {
        setBrands(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the brands data!", error);
      });
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesVehicleCondition = selectedVehicleCondition !== null ? vehicle.vehicleCondition === selectedVehicleCondition : true;
    const matchesBrand = selectedBrand ? vehicle.brand.brandName === selectedBrand : true;
    const matchesSearchQuery = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInStock = status ? vehicle.status === 0 : true;
    const isStatusNotNull = vehicle.status !== null;
    return matchesVehicleCondition && matchesBrand && matchesSearchQuery && matchesInStock && isStatusNotNull;
  });

  // Pagination logic
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle); 

  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Row>
        <Col>
          <div className="mb-3">
            <h5><b>Filter by Brand</b></h5>
            <div className="d-flex flex-wrap">
              <Button
                variant={selectedBrand === null ? 'outline-dark' : 'outline-dark'}
                className="me-2 mb-2"
                href='#all'
                onClick={() => setSelectedBrand(null)}
              >
                All Vehicles
              </Button>
              {brands.map((brand, index) => (
                <Button
                  key={index}
                  variant={selectedBrand === brand.brandName ? 'outline-dark' : 'outline-dark'}
                  href={`/#${brand.brandName}`}
                  className="me-2 mb-2"
                  onClick={() => setSelectedBrand(brand.brandName)}
                >
                  {brand.brandName}
                </Button>
              ))}
            </div>
          </div>
        </Col>
        <Col>
          <Form.Group controlId="searchQuery" className="mb-3">
            <Form.Label>Search by Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter vehicle name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="status" className="mb-3">
        <Form.Check
          type="checkbox"
          label="Show Only In-Stock Vehicles"
          checked={status}
          onChange={(e) => setStatus(e.target.checked)}
        />
      </Form.Group>

      <Row>
        {currentVehicles.length > 0 ? (
          currentVehicles.map((vehicle, index) => (
            <Col key={vehicle.vehicleID} md={3} className="d-flex align-items-stretch mb-4">
              <VehicleCard
                name={vehicle.name}
                description={`Engine: ${vehicle.engineType || 'N/A'}, Mileage: ${vehicle.mileage || 'N/A'}`} 
                imagePath={`${config.Url}${vehicle.imagePath}`}
                price={vehicle.price}
                modelNumber={vehicle.modelNumber}
                color={vehicle.color}
                brandName={vehicle.brand ? vehicle.brand.brandName : "Unknown"}
                vehicleCondition={vehicle.vehicleCondition}
                status={vehicle.status}
                vehicleID={vehicle.vehicleID}
              />
            </Col>
          ))
        ) : (
          <p>No vehicles found.</p>
        )}
      </Row>

      <Pagination className="justify-content-center mt-4">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <Pagination.Item key={pageNumber} active={pageNumber === currentPage} variant="outline-dark" onClick={() => handlePageChange(pageNumber)}>
            {pageNumber}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </>
  );
};

export default VehicleList;
