import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function EditViewLayout() {
    const [view, setView] = useState({
        contact: '',
        contactMap: '',
        mapType: '',
        mail: '',
        showroomType: '',
        footerSlogan: '',
        shopIntroduction: '',
        urlFace: '',
        urltwitter: '',
        urlinstagram: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/View`);
                setView(response.data);
            } catch (error) {
                setErrorMessage('Error fetching view data.');
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setView({ ...view, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${config.apiUrl}/View`, view);
            alert('View layout updated successfully!');
            navigate('/admin/viewLayout');
        } catch (error) {
            setErrorMessage(`Failed to update view layout. ${error.response ? error.response.data.message : error.message}`);
        }
    };

    return (
        <Row className="justify-content-center">
            <Col xs={12}>
                <h3>Edit View Layout</h3>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Contact</Form.Label>
                            <Form.Control
                                type="text"
                                name="contact"
                                value={view.contact}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Contact Map</Form.Label>
                            <Form.Control
                                type="text"
                                name="contactMap"
                                value={view.contactMap}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Map type</Form.Label>
                            <Form.Control
                                type="mapType"
                                name="mapType"
                                value={view.mapType}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Mail</Form.Label>
                            <Form.Control
                                type="email"
                                name="mail"
                                value={view.mail}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Showroom Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="showroomType"
                                value={view.showroomType}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Footer Slogan</Form.Label>
                            <Form.Control
                                type="text"
                                name="footerSlogan"
                                value={view.footerSlogan}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <strong><i className="bi bi-instagram"></i></strong>
                            <Form.Control
                                type="text"
                                rows={3}
                                name="urlinstagram"
                                value={view.urlinstagram}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <strong><i className="bi bi-facebook"></i></strong>
                            <Form.Control
                                type="text"
                                rows={3}
                                name="urlFace"
                                value={view.urlFace}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <strong><i className="bi bi-twitter"></i></strong>
                            <Form.Control
                                type="text"
                                rows={3}
                                name="urltwitter"
                                value={view.urltwitter}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Shop Introduction</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="shopIntroduction"
                                value={view.shopIntroduction}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Button type="submit">Update View Layout</Button>
                </Form>
            </Col>
        </Row>
    );
}

export default EditViewLayout;
