import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

function EditHeader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [header, setHeader] = useState({
    imgBanner: '',
    tile: '',
    status: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/Header/${id}`);
        setHeader(response.data);
      } catch (error) {
        console.error('Error fetching header data:', error);
      }
    };

    fetchHeader();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeader((prevHeader) => ({
      ...prevHeader,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${config.apiUrl}/Header/${id}`, header);

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('headerId', id); 

        await axios.post(`${config.apiUrl}/Header/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/admin/viewLayout');
    } catch (error) {
      console.error('Error updating header:', error);
    }
  };

  return (
    <Container>
      <h1>Edit Header</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formImgBanner">
          <Form.Label>Image Banner URL</Form.Label>
          <Form.Control
            type="text"
            name="imgBanner"
            value={header.imgBanner}
            onChange={handleChange}
            disabled 
          />
        </Form.Group>
        <Form.Group controlId="formTile">
          <Form.Label>Tile</Form.Label>
          <Form.Control
            type="text"
            name="tile"
            value={header.tile}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            type="text"
            name="status"
            value={header.status}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formFile">
          <Form.Label>Upload New Banner Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}

export default EditHeader;
