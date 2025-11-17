import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../config';
import Footer from './Footer';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/index.css';

const Contact = () => {
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
                Contact {view.showroomType} <i className="bi bi-check-circle icon-success"></i>
            </h1>
            <Row>
                <Col md={6}>
                    <div className="map-container">
                        <iframe
                            src={view.contactMap}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Maps Location"
                        ></iframe>
                    </div>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Contact Us</Card.Title>
                            <Card.Text>
                                <i className="bi bi-geo-alt"></i>{' '}
                                <strong>Address {view.showroomType}:</strong> {view.mapType}
                                <br />
                                If you have any questions, please reach out to us at:
                                <br />
                                <strong>Email:</strong> {view.mail}
                                <br />
                                <strong>Phone:</strong> {view.contact}
                                <br />
                            </Card.Text>
                            <div className="social-icons">
                                <a href={view.urlFace} className='me-4 text-reset'>
                                    <i className="bi bi-facebook"></i>
                                </a>
                                <a href={view.urltwitter} className='me-4 text-reset'>
                                    <i className="bi bi-twitter"></i>
                                </a>
                                <a href={view.urlinstagram} className='me-4 text-reset'>
                                    <i className="bi bi-instagram"></i>
                                </a>
                            </div>
                            We're here to help!
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};

export default Contact;
