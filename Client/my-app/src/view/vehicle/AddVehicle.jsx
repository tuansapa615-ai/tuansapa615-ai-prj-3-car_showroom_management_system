import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

function AddVehicle({ onVehicleAdded }) {
  const [newVehicle, setNewVehicle] = useState({
    modelNumber: '',
    name: '',
    price: '',
    manufactureDate: '',
    color: '',
    mileage: 0,
    engineType: '',
    vehicleCondition: '0',
    brandID: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/brands`);
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setErrorMessage('Error fetching brands.');
      }
    };

    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({
      ...newVehicle,
      [name]: name === 'vehicleCondition' ? value : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('modelNumber', newVehicle.modelNumber);
      formData.append('name', newVehicle.name);
      formData.append('price', newVehicle.price);
      formData.append('manufactureDate', newVehicle.manufactureDate);
      formData.append('color', newVehicle.color);
      formData.append('mileage', newVehicle.mileage);
      formData.append('engineType', newVehicle.engineType);
      formData.append('vehicleCondition', newVehicle.vehicleCondition);
      formData.append('brandID', newVehicle.brandID);

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await axios.post(`${config.apiUrl}/vehicles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Vehicle created successfully!');
      if (onVehicleAdded) {
        onVehicleAdded(response.data);
      }

      if (location.pathname.includes('/admin')) {
        navigate('/admin/');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/');
      }

      setNewVehicle({
        modelNumber: '',
        name: '',
        price: '',
        manufactureDate: '',
        color: '',
        mileage: 0,
        engineType: '',
        vehicleCondition: '0',
        brandID: '',
      });
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error('Submission error:', error.response?.data);
      setErrorMessage(`Failed to create vehicle. ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Add New Vehicle</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          {/* Các trường nhập liệu khác */}
          <Row className="mb-2">
            <Col>
              <Form.Group controlId="formModelNumber">
                <Form.Label>Model Number</Form.Label>
                <Form.Control
                  name="modelNumber"
                  placeholder="Model Number"
                  value={newVehicle.modelNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formName">
                <Form.Label>Vehicle Name</Form.Label>
                <Form.Control
                  name="name"
                  placeholder="Vehicle Name"
                  value={newVehicle.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>


          <Row className="mb-2">
            <Col>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={newVehicle.price}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formImage">
                <Form.Label>Vehicle Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Group controlId="formManufactureDate">
                <Form.Label>Manufacture Date</Form.Label>
                <Form.Control
                  type="date"
                  name="manufactureDate"
                  value={newVehicle.manufactureDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formColor">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  name="color"
                  placeholder="Color"
                  value={newVehicle.color}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Group controlId="formVehicleCondition">
                <Form.Label>Vehicle Condition</Form.Label>
                <Form.Select
                  name="vehicleCondition"
                  value={newVehicle.vehicleCondition}
                  onChange={handleChange}
                  required
                >
                  <option value="0">New</option>
                  <option value="1">Used</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formMileage">
                <Form.Label>Mileage</Form.Label>
                <Form.Control
                  type="number"
                  name="mileage"
                  placeholder="Mileage"
                  value={newVehicle.mileage}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Group controlId="formEngineType">
                <Form.Label>Engine Type</Form.Label>
                <Form.Control
                  name="engineType"
                  placeholder="Engine Type"
                  value={newVehicle.engineType}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formBrandID">
                <Form.Label>Brand</Form.Label>
                <Form.Select
                  name="brandID"
                  value={newVehicle.brandID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.brandID} value={brand.brandID}>
                      {brand.brandName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>{imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Vehicle Preview" style={{ width: '200px', height: 'auto' }} />
              </div>
            )}</Col>
            <Col><Button type="submit">Add Vehicle</Button></Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default AddVehicle;
