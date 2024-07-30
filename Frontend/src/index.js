// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import HomePage from './Components/Homepage';
import AdminLogin from './Components/Adminlogin';
import AdminPage from './Components/AdminPage';
import UserView from './Components/UserView'; // Import the UserView component

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user-view" element={<UserView />} /> {/* Add the UserView route */}
      </Routes>
    </Router>
  </MantineProvider>
);
