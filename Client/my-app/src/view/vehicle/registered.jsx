import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { Container, Table, Row, Col, Form, Button } from 'react-bootstrap';

function Stock() {
    const [vehicles, setVehicles] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/vehicles/registered`);
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/brands`);
                setBrands(response.data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchVehicles();
        fetchBrands();
    }, []);

    const getBrandName = (brandID) => {
        const brand = brands.find(b => b.brandID === brandID);
        return brand ? brand.brandName : 'Unknown Brand';
    };

    const getVehicleCondition = (condition) => {
        switch (condition) {
            case 0:
                return 'New';
            case 1:
                return 'Used';
            default:
                return 'Unknown';
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    };

    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.value);
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearchTerm = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = selectedBrand ? vehicle.brandID === parseInt(selectedBrand) : true;
        return matchesSearchTerm && matchesBrand;

    });

    return (
        <Container>
            <h1>Vehicle registered</h1>
            <Row className="mb-3 mt-3 justify-content-center">
                <Col xs={6} className="d-flex justify-content-center">
                    <Form.Control
                        type="text"
                        placeholder="Search by name"
                        className="mr-sm-2"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col xs={4} className="d-flex justify-content-center">
                    <Form.Select value={selectedBrand} onChange={handleBrandChange}>
                        <option value="">All Brands</option>
                        {brands.map(brand => (
                            <option key={brand.brandID} value={brand.brandID}>
                                {brand.brandName}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>VehicleID</th>
                            <th>ModelNumber</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Manufacture Date</th>
                            <th>Registration Date</th>
                            <th>Vehicle Condition</th>
                            <th>Brand Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.map(vehicle => (
                            <tr key={vehicle.vehicleID}>
                                <td>{vehicle.vehicleID}</td>
                                <td>{vehicle.modelNumber}</td>
                                <td>{vehicle.name}</td>
                                <td>{formatPrice(vehicle.price)}</td>
                                <td>
                                    {vehicle.imagePath ? (
                                        <img src={`${config.Url}${vehicle.imagePath}`} alt={vehicle.name} style={{ width: '50px', height: 'auto' }} />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td>{vehicle.manufactureDate.split('T')[0]}</td>
                                <td>{vehicle.registrationDate.split('T')[0]}</td>
                                <td>{getVehicleCondition(vehicle.vehicleCondition)}</td>
                                <td>{getBrandName(vehicle.brandID)}</td>
                                <td>
                                    <Button
                                        type="button"
                                        href={`./add-editRegistration/${vehicle.vehicleID}`}
                                        className="mx-2"
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}

export default Stock;
