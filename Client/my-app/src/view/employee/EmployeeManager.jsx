import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import CustomerManager from '../customer/CustomerManagement';
function EmployeeManager() {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/employees`);
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
                setErrorMessage('Error fetching employees.');
            }
        };

        fetchEmployees();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDeleteEmployee = async (employeeID) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`${config.apiUrl}/employees/${employeeID}`);
                setEmployees(employees.filter(employee => employee.employeeID !== employeeID));
                alert('Employee deleted successfully!');
            } catch (error) {
                console.error('Error deleting employee:', error);
                const errorMessage = error.response ? error.response.data.message : error.message;
                alert(`Failed to delete employee. Error: ${errorMessage}`);
            }
        }
    };

    const filteredEmployees = employees.filter(employee => {
        return (
            employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <Container>
            <CustomerManager />

            <h1>Employee manager</h1>
            <Row className="mb-3 mt-3 justify-content-center">
                <Col xs={8} className="d-flex justify-content-center">
                    <Form.Control
                        type="text"
                        placeholder="Search by name or email"
                        className="mr-sm-2"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col xs={2} className="d-flex justify-content-end">
                    <Button href='./add-employee' className="mx-2">Add Employee</Button>
                </Col>
            </Row>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                            <th>Date of Joining</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map(employee => (
                                <tr key={employee.employeeID}>
                                    <td>{employee.employeeID}</td>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.contactNumber}</td>
                                    <td>{employee.email}</td>
                                    <td>{new Date(employee.dateOfJoining).toLocaleDateString()}</td>
                                    <td className='text-align-center'>
                                        <Button
                                            type="button"
                                            href={`./edit-employee/${employee.employeeID}`}
                                            className="mx-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            type="button"
                                            className="mx-2"
                                            variant="danger"
                                            onClick={() => handleDeleteEmployee(employee.employeeID)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No employees found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}

export default EmployeeManager;