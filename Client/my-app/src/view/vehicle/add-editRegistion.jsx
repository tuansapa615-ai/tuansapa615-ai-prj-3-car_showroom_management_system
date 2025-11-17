import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

function EditRegistrationDate() {
  const { id } = useParams(); 
  const [registrationDate, setRegistrationDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/vehicles/${id}`);
        
        // Format the date to `yyyy-MM-dd` before setting it
        const formattedDate = response.data.registrationDate.split('T')[0];
        setRegistrationDate(formattedDate);
      } catch (error) {
        setErrorMessage('Failed to fetch vehicle details.');
      }
    };

    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    setRegistrationDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${config.apiUrl}/vehicles/register/${id}`, {
        registrationDate: registrationDate,
      });
      console.log('Registration date updated successfully:', response.data);
      alert('Registration date updated successfully!');
      if (location.pathname.includes('/admin')) {
        navigate('/admin/viewRegistration');
      } else if (location.pathname.includes('/user')) {
        navigate('/user/viewRegistration');
      }
    } catch (error) {
      setErrorMessage(`Failed to update registration date. ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <h3>Add & Edit Registration Date</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Registration Date</Form.Label>
              <Form.Control
                type="date"
                name="registrationDate"
                value={registrationDate}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Button type="submit">Update Registration Date</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditRegistrationDate;
