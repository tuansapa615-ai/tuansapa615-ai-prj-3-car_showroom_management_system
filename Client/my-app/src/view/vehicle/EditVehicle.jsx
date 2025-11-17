import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditVehicle() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState({
    modelNumber: '',
    name: '',
    price: '',
    manufactureDate: '',
    color: '',
    mileage: '',
    engineType: '',
    vehicleCondition: '',
    brandID: '',
  });
  const [brands, setBrands] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleResponse, brandsResponse] = await Promise.all([
          axios.get(`${config.apiUrl}/vehicles/${id}`),
          axios.get(`${config.apiUrl}/brands`),
        ]);
        setVehicle(vehicleResponse.data);
        setBrands(brandsResponse.data);
      } catch (error) {
        setErrorMessage('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({
      ...vehicle,
      [name]: name === "vehicleCondition" ? parseInt(value) : value,
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!vehicle.name || !vehicle.price || !vehicle.brandID) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    Object.keys(vehicle).forEach((key) => {
      formData.append(key, vehicle[key]);
    });
    if (imageFile) {
      formData.append('imageFile', imageFile); // Append the image file
    }

    try {
      await axios.put(`${config.apiUrl}/vehicles/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Vehicle updated successfully!');

      if (location.pathname.includes('/admin')) {
        navigate('/admin/');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/');
      }
    } catch (error) {
      setErrorMessage(`Failed to update vehicle. ${error.response ? error.response.data.error : error.message}`);
    }
  };

  if (loading) {
    return <Spinner animation="border" />; // Show loader while fetching data
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Edit Vehicle</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Row className="mb-2">
            <Col>
              <Form.Label>Model Number</Form.Label>
              <Form.Control
                name="modelNumber"
                placeholder="Model Number"
                value={vehicle.modelNumber}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Control
                name="name"
                placeholder="Vehicle Name"
                value={vehicle.name}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Price"
                value={vehicle.price}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Manufacture Date</Form.Label>
              <Form.Control
                type="date"
                name="manufactureDate"
                value={vehicle.manufactureDate?.split('T')[0] || ''}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Color</Form.Label>
              <Form.Control
                name="color"
                placeholder="Color"
                value={vehicle.color}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Mileage</Form.Label>
              <Form.Control
                type="number"
                name="mileage"
                placeholder="Mileage"
                value={vehicle.mileage}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Engine Type</Form.Label>
              <Form.Control
                name="engineType"
                placeholder="Engine Type"
                value={vehicle.engineType}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Vehicle Condition</Form.Label>
              <Form.Select
                name="vehicleCondition"
                value={vehicle.vehicleCondition}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle Condition</option>
                <option value="0">New</option>
                <option value="1">Used</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Brand</Form.Label>
              <Form.Select
                name="brandID"
                value={vehicle.brandID}
                onChange={handleChange}
                required
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.brandID} value={brand.brandID}>
                    {brand.brandName}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                name="imageFile"
                onChange={handleFileChange}
              />
            </Col>
          </Row>
          <Button variant="primary" type="submit">Update Vehicle</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditVehicle;
