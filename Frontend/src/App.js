import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Homepage';
import AdminLogin from './Components/Adminlogin';
import AdminPage from './Components/AdminPage';
import UserView from './Components/UserView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user-view" element={<UserView />} />
      </Routes>
    </Router>
  );
}

export default App;
