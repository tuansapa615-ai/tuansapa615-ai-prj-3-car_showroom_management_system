import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';

function BrandManager() {
    const [brands, setBrands] = useState([]);
    const [newBrand, setNewBrand] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch brand data from API
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
        setNewBrand(e.target.value);
    };

    const handleAddBrand = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${config.apiUrl}/brands`, { brandName: newBrand });
            setBrands([...brands, response.data]);
            setNewBrand('');
            setErrorMessage('');
            alert('Brand added successfully!');
        } catch (error) {
            console.error('Error adding brand:', error);
            setErrorMessage(`Failed to add brand. ${error.response ? error.response.data.message : error.message}`);
        }
    };

    // const handleDeleteBrand = async (brandID) => {
    //     if (window.confirm('Are you sure you want to delete this brand?')) {
    //         try {
    //             await axios.delete(`${config.apiUrl}/brands/${brandID}`);
    //             setBrands(brands.filter(brand => brand.brandID !== brandID));
    //             alert('Brand deleted successfully!');
    //         } catch (error) {
    //             console.error('Error deleting brand:', error);
    //             const errorMessage = error.response ? error.response.data.message : error.message;
    //             alert(`Failed to delete brand. Error: ${errorMessage}`);
    //         }
    //     }
    // };

    return (
        <Container>
            <h1>Brand manager</h1>
            <Row className="mb-3 mt-3 justify-content-center">
                <Col xs={8} className="d-flex justify-content-center">
                    <Form.Control
                        type="text"
                        placeholder="Add New Brand"
                        value={newBrand}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col xs={2} className="d-flex justify-content-end">
                    <Button onClick={handleAddBrand}>Add Brand</Button>
                </Col>
            </Row>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Brand ID</th>
                        <th>Brand Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.length > 0 ? (
                        brands.map(brand => (
                            <tr key={brand.brandID}>
                                <td>{brand.brandID}</td>
                                <td>{brand.brandName}</td>
                                <td>
                                    <Button
                                        type="button"
                                        href={`./edit-brand/${brand.brandID}`}
                                        className="mx-2"
                                    >
                                        Edit
                                    </Button>
                                    {/* <Button
                                        type="button"
                                        variant="danger"
                                        onClick={() => handleDeleteBrand(brand.brandID)}
                                    >
                                        Delete
                                    </Button> */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">No brands found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
}

export default BrandManager;