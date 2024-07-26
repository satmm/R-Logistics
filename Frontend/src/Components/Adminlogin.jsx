import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Adminlogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'password') {
            navigate('/admin');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="admin-input-container">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="admin-input-container">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="admin-login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
