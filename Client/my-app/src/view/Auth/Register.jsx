import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom'; // Import Link
import '../../css/index.css';
import Footer from '../../view_customer/Footer';
import axios from 'axios';
import config from '../../config';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullName] = useState('');
    const [roleID, setRoleID] = useState(2);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${config.apiUrl}/auth/register`, {
                username: username,
                password: password,
                fullname: fullname,
                roleID: roleID,
            });
            alert('User registered successfully. Waiting for approval.');
            navigate('/login');
        } catch (error) {
            alert('Error registering user: ' + (error.response?.data || 'Unknown error'));
        }
    };

    return (
        <Container>
            <div className="form-container">
                <h2>Register</h2>
                <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3" controlId="formBasicFullName">
                        <Form.Label className="form-label">Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label className="form-label">Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="form-label">Password</Form.Label>
                        <div className="password-container">
                            <Form.Control
                                type={showPassword ? 'text' : 'password'} // Hiển thị mật khẩu nếu showPassword là true
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required

                            />
                            <Button
                                variant="outline-dark"
                                onClick={() => setShowPassword(!showPassword)} // Chuyển đổi trạng thái hiển thị mật khẩu
                            >
                                {showPassword ? <EyeSlash /> : <Eye />} {/* Biểu tượng mắt */}
                            </Button>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicRole">
                        <Form.Label className="form-label">Role</Form.Label>
                        <Form.Select
                            aria-label="Select Role"
                            value={roleID}
                            onChange={(e) => setRoleID(parseInt(e.target.value))}
                        >
                            <option value={2}>User</option>
                            <option value={1}>Admin</option>
                        </Form.Select>
                    </Form.Group>

                    <Button variant="outline-dark" className='btn-login-register' type="submit">
                        Register
                    </Button>
                </Form>
                <div className="mt-3">
                    <Link to="/login" style={{
                        color: '#ffffff',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                    }}>
                        Already have an account? Login here
                    </Link>
                </div>
            </div>
            <Footer />
        </Container>
    );
};

export default Register;
