import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { FaUserShield, FaUser } from 'react-icons/fa';
import backgroundImage from './background-image.jpg'; // Import the image

const Home = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin-login');
  };

  const handleUserClick = () => {
    navigate('/user-view');
  };

  return (
    <div className="home-container">
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }} />
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
