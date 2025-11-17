import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Container, Row, Col, Button, Card, Table } from 'react-bootstrap';

function ViewLayout() {
  const [view, setView] = useState([]);
  const [header, setHeader] = useState([]);
  useEffect(() => {
    const fetchView = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/View`);
        setView([response.data]);
      } catch (error) {
        console.error('Error fetching View data:', error);
      }
    };

    fetchView();
  }, []);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/Header`);
        setHeader(response.data); 
      } catch (error) {
        console.error('Error fetching Header data:', error);
      }
    };

    fetchHeader();
  }, []);

  return (
    <Container>
      <Row className="mb-3 mt-3 ">
        <Col xs={8} className="d-flex ">
          <h1>View Layout Manager</h1>
        </Col>
        <Col xs={2} className="d-flex justify-content-end">
          <Button href='./edit-view' className="mx-2" variant="outline-dark">Edit layout</Button>
        </Col>
      </Row>
      {view.length > 0 ? (
        view.map((item, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>View Details</Card.Title>
              <Card.Text>
                <strong>Contact:</strong> {item.contact}<br />
                <strong>Contact Map:</strong> {item.contactMap}<br />
                <strong>Map Type:</strong> {item.mapType}<br />
                <strong>Mail:</strong> {item.mail}<br />
                <strong>Showroom Type:</strong> {item.showroomType}<br />
                <strong>Footer Slogan:</strong> {item.footerSlogan}<br />
                <strong>Shop Introduction:</strong><br />
                {item.shopIntroduction.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
                <strong><i className="bi bi-facebook"></i></strong> {item.urlFace}<br />
                <strong><i className="bi bi-twitter"></i></strong> {item.urltwitter}<br />
                <strong><i className="bi bi-instagram"></i></strong> {item.urlinstagram}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="text-center">No view data found.</div>
      )}
      <h1>Header Manager</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Img Banner</th>
            <th>Tile</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {header.length > 0 ? (
            header.map(headers => (
              <tr key={headers.id}>
                <td>{headers.id}</td>
                <td><img src={`${config.Url}/${headers.imgBanner}`} alt="Banner" style={{ width: '100px' }} /></td>
                <td>{headers.tile}</td>
                <td>{headers.status}</td>
                <td>
                  <Button
                    type="button"
                    href={`./edit-header/${headers.id}`}
                    className="mx-2"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))  
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No headers found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default ViewLayout;
