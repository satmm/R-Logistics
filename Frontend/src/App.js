// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/Homepage';
import AdminPage from './Components/AdminPage';
import AdminLogin from './Components/Adminlogin';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
};

export default App;
