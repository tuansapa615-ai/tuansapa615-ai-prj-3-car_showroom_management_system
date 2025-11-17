import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './Footer';
import { Container, Row, Col, Card } from 'react-bootstrap';
import logoAbout from './logoAbout.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import '../css/index.css'; 

const AboutUs = () => {
    const [view, setView] = useState(null);

    useEffect(() => {
        const fetchView = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/View`);
                setView(response.data);
            } catch (error) {
                console.error('Error fetching View data:', error);
            }
        };

        fetchView();
    }, []);
    if (!view) {
        return <div>Loading...</div>;
    }

    return (
        <Container className='about'>
            <h1 className='text-center'>
                About {view.showroomType} <i className="bi bi-check-circle icon-success"></i>
            </h1>
            <Row>
                <Col md={6}>
                    <div className='d-flex'>
                        <img
                            src={logoAbout}
                            alt="About Us Logo"
                            width="100%"
                            height="auto"
                            style={{ border: 0 }}
                        />
                    </div>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>About Us</Card.Title>
                            <Card.Text className="details-text">
                                <strong>Address {view.showroomType}:</strong> {view.mapType}<br />
                                <strong>Telephone:</strong> {view.contact}<br />
                                <strong>Introduce about {view.showroomType}:</strong><br />
                                {view.shopIntroduction && view.shopIntroduction.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};

export default AboutUs;
