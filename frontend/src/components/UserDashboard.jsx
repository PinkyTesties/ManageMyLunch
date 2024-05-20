import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from './componentAssets/logov1.png';
import '../style/UserDashboard.css';

Modal.setAppElement('#root');

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
    axios.get('http://localhost:8082')
      .then((res) => {
        if (res.data.valid) {
          setUserDetails({
            name: res.data.name,
            email: res.data.email,
            university: res.data.university,
            userID: res.data._id,
          });
        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className='dashboard'>
      {/* Header */}
      <header className='dashboard-header'>
        <h1 className='title'>Manage My Lunch Dashboard</h1>
        <p className='user-info'>Logged in as: {userDetails.name}, {userDetails.university}</p>
        <div className='menu-buttons'>
          <button onClick={toggleDropdown} className='account-button'>Account</button>
          <Link to="/Reports"><button className='reports-button'>Reports</button></Link>
          <Link to="/CompleteOrder"><button className='order-button'>Pick Up Order</button></Link>
          <Link to="/Cart"><button className='cart-button'>Cart</button></Link>
        </div>
      </header>

      {/* Account Modal */}
      <Modal
        isOpen={showDropdown}
        onRequestClose={toggleDropdown}
        contentLabel="Account Menu"
        className="account-modal"
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