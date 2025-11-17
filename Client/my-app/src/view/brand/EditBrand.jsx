import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditBrand() {
  const { id } = useParams(); // Get `id` from URL
  const [brand, setBrand] = useState({ brandName: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  

  // Fetch current brand data
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/brands/${id}`);
        setBrand(response.data);
      } catch (error) {
        setErrorMessage('Error fetching brand data.');
      }
    };

    fetchBrand();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrand({ ...brand, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${config.apiUrl}/brands/${id}`, brand);
      console.log('Brand updated successfully:', response.data);
      alert('Brand updated successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/brand-list');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/brand-list');
      }
    } catch (error) {
      setErrorMessage(`Failed to update brand. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Edit Brand</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Brand Name</Form.Label>
              <Form.Control
                name="brandName"
                placeholder="Brand Name"
                value={brand.brandName}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">Update Brand</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditBrand;