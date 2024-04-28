//UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from './componentAssets/logov1.png';
import { backendURL } from './../urls'; // import backendURL from urls.js

Modal.setAppElement('#root');

const ButtonLink = ({ to, children }) => (
  <button>
    <Link to={to} style={{ textDecoration: 'none', color: 'Black' }}>
      {children}
    </Link>
  </button>
);

const UserDashboard = ({ history }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    university: '',
    userID: '',
  });

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    axios.get(`${backendURL}`, { withCredentials: true })
      .then((res) => {
        console.log('Server response:', res);
  
        if (res.data.valid) {
          setUserDetails({
            name: res.data.Session.name,
            email: res.data.Session.email,
            university: res.data.Session.university,
            userID: res.data.Session.userId,
          });
        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <div className='header'>
        <header className='header'>
          <img src={logo} alt='Logo' height={100} />
          <h1>Manage My Lunch Dashboard</h1>
        </header>
        <div className='MenuButtons'>
          <button onClick={toggleDropdown}>Account</button>
          <ButtonLink to="/Reports">Reports</ButtonLink>
          <ButtonLink to="/CompleteOrder">Pick Up Order</ButtonLink>
          <ButtonLink to="/Cart">Cart</ButtonLink>
          <ButtonLink to="/">Logout</ButtonLink>
        </div>
      </div>
      <p>Logged in as: {userDetails.name}, {userDetails.university}, {userDetails.email}, {userDetails.userID}</p>
      <Modal
        isOpen={showDropdown}
        onRequestClose={toggleDropdown}
        contentLabel="Account Menu"
        className="my-modal"
      >
        <a href="#">Profile</a><br></br>
        <a href="SettingsPage">Settings</a><br></br>
        <a href="OrderStatus">Orders</a><br></br>
        <a href="/">Logout</a><br></br>
      </Modal>
    </div>
  );
};

export default UserDashboard;