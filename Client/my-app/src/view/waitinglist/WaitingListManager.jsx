import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';

function WaitingListManager() {
  const [waitingList, setWaitingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchWaitingList = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/waitinglist`);
        setWaitingList(response.data);
      } catch (error) {
        console.error('Error fetching waiting list:', error);
        setErrorMessage('Error fetching waiting list.');
      }
    };

    fetchWaitingList();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteRequest = async (waitingListID) => {
    if (window.confirm('Are you sure you want to remove this request from the waiting list?')) {
      try {
        await axios.delete(`${config.apiUrl}/waitinglist/${waitingListID}`);
        setWaitingList(waitingList.filter(request => request.waitingListID !== waitingListID));
        alert('Request removed from the waiting list successfully!');
      } catch (error) {
        console.error('Error deleting request:', error);
        const errorMessage = error.response ? error.response.data.message : error.message;
        alert(`Failed to remove request. Error: ${errorMessage}`);
      }
    }
  };

  const filteredWaitingList = waitingList.filter(request => {
    return (
      request.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.vehicle.modelNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Container>
      <h1>waiting manager</h1>
      <Row className="mb-3 mt-3 justify-content-center">
        <Col xs={8} className="d-flex justify-content-center">
          <Form.Control
            type="text"
            placeholder="Search by customer name or vehicle model"
            className="mr-sm-2"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col xs={2} className="d-flex justify-content-end">
          <Button href='./add-waitinglist' className="mx-2">Add</Button>
        </Col>
      </Row>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Customer Name</th>
            <th>Contact Number</th>
            <th>Vehicle Model</th>
            <th>Request Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredWaitingList.length > 0 ? (
            filteredWaitingList.map(request => (
              <tr key={request.waitingListID}>
                <td>{request.waitingListID}</td>
                <td>{`${request.customer.firstName} ${request.customer.lastName}`}</td>
                <td>{request.customer.contactNumber}</td>
                <td>{request.vehicle.modelNumber} - {request.vehicle.name} - {request.vehicle.brand.brandName}</td>
                <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                <td className='text-align-center'>
                  <Button
                    type="button"
                    href={`./edit-waitinglist/${request.waitingListID}`}
                    className="mx-2"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    className="mx-2"
                    variant="danger"
                    onClick={() => handleDeleteRequest(request.waitingListID)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No waiting list requests found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default WaitingListManager;
