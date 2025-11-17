import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Col, Row } from 'react-bootstrap';
import axios from 'axios';

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('https://localhost:7008/api/auth/pending-users');
        setPendingUsers(response.data);
      } catch (error) {
        alert('Error fetching pending users: ' + (error.response?.data || 'Unknown error'));
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axios.post(`https://localhost:7008/api/auth/approve/${userId}`);
      setPendingUsers(pendingUsers.filter(user => user.userID !== userId));
      alert('User approved successfully!');
    } catch (error) {
      alert('Error approving user: ' + (error.response?.data || 'Unknown error'));
    }
  };

  const filteredUsers = pendingUsers.filter(user =>
    (roleFilter === 'All' || (roleFilter === '1' && user.roleID === 1) || (roleFilter === '2' && user.roleID === 2)) &&
    (user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-container">
      <h2>Pending Users</h2>
      <Row className="mb-3 mt-3 justify-content-center">
        <Col xs={8} className="d-flex justify-content-center mb-3">
          <Form.Control
            type="text"
            placeholder="Search by Fullname or Username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xs={4} className="d-flex justify-content-center mb-3">
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="1">Admin</option>
            <option value="2">User</option>
          </Form.Select>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Full name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.userID}>
                <td>{user.userID}</td>
                <td>{user.fullname}</td>
                <td>{user.username}</td>
                <td>{user.roleID === 1 ? 'Admin' : 'User'}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handleApprove(user.userID)}
                  >
                    Approve
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No pending users found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PendingUsers;
