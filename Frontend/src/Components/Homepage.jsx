import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { FaUserShield, FaUser } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin-login');
  };

  const handleUserClick = () => {
    alert('User card clicked');
  };

  return (
    <div className="home-container">
      <div className="card" onClick={handleAdminClick}>
        <FaUserShield className="icon" />
        <h2>Admin</h2>
      </div>
      <div className="card" onClick={handleUserClick}>
        <FaUser className="icon" />
        <h2>User</h2>
      </div>
    </div>
  );
};

export default Home;
