import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Adminlogin.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const storedUsername = process.env.REACT_APP_ADMIN_USERNAME;
        const storedPassword = process.env.REACT_APP_ADMIN_PASSWORD;

        if (username === storedUsername && password === storedPassword) {
            navigate('/admin');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="background-image" />
            <div className="admin-login-card">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="admin-input-container">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="admin-input-container">
                        <label>Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="Login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
