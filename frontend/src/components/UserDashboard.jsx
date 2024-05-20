import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from './componentAssets/logov1.png';

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
  const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [university, setUniversity] = useState('');
const [userID, setUserID] = useState('');
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
    <div>
            <div className='header'>
        <header className='header'>
          <img src={logo} alt='Logo' height={100} />
          <h1>Manage My Lunch Dashboard</h1>
          <p></p>

        </header>

        <hr />
        <p>Logged in as: {userDetails.name}, {userDetails.university}</p>
        <p>*** CSS NOT DONE - DO NOT SUBMIT ***</p>

        <div className='MenuButtons'>
          <button onClick={toggleDropdown}>Account</button>
          <button><Link to="/Dashboard" style={{ textDecoration: 'none', color: 'Black' }}>Dashboard</Link></button>
          <button><Link to="/OrderStatus" style={{ textDecoration: 'none', color: 'Black' }}>Orders</Link></button>

          <button><Link to="/Reports" style={{ textDecoration: 'none', color: 'Black' }}>Reports</Link></button>
          <button><Link to="/CompleteOrder" style={{ textDecoration: 'none', color: 'Black' }}>Pick Up Order</Link></button>
          <button><Link to="/Cart" style={{ textDecoration: 'none', color: 'Black' }}>Cart</Link></button>
        </div>
      </div>
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
      <hr />
    </div>
  );
};

export default UserDashboard;