import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from './componentAssets/logov1.png';
import '../style/UserDashboard.css';

Modal.setAppElement('#root');

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
    <div className='dashboard'>
      {/* Header */}
      <header className='dashboard-header'>
        <img src={logo} alt='Logo' height={100} />
        <h1 className='title'>Manage My Lunch Dashboard</h1>
        <div className='menu-buttons'>
          <button onClick={toggleDropdown} className='account-button'>Account</button>
          <Link to="/dashboard"><button className='cart-button'>Dashboard</button></Link>
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
        style={{
          content: {
            width: '500px', // adjust as needed
            height: '600px', // adjust as needed
            right: '0px', // positions the modal on the right
            left: 'auto', // overrides the default left positioning
          }
        }}
      >
        <h1>Account Menu</h1>
        <h4>Logged in as: {userDetails.name}</h4>
        <p style={{ fontSize: '9pt' }}>{userDetails.university}</p>
        <br></br>
        <a href="dashboard" style={{ display: 'block', padding: '10px', margin: '5px 0', backgroundColor: '#f2eded', textDecoration: 'none', color: 'black', textAlign: 'center', borderRadius: '5px' }}>Dashboard</a>
        <a href="SettingsPage" style={{ display: 'block', padding: '10px', margin: '5px 0', backgroundColor: '#f2eded', textDecoration: 'none', color: 'black', textAlign: 'center', borderRadius: '5px' }}>Settings</a>
        <a href="CompleteOrder" style={{ display: 'block', padding: '10px', margin: '5px 0', backgroundColor: '#f2eded', textDecoration: 'none', color: 'black', textAlign: 'center', borderRadius: '5px' }}>Pickup Order</a>
        <a href="Cart" style={{ display: 'block', padding: '10px', margin: '5px 0', backgroundColor: '#f2eded', textDecoration: 'none', color: 'black', textAlign: 'center', borderRadius: '5px' }}>Cart</a>
        <a href="OrderStatus" style={{ display: 'block', padding: '10px', margin: '5px 0', backgroundColor: '#f2eded', textDecoration: 'none', color: 'black', textAlign: 'center', borderRadius: '5px' }}>Orders</a><br></br><br></br>
        <a href="/" style={{ display: 'block', padding: '10px', margin: '5px 0', backgroundColor: '#f2eded', textDecoration: 'none', color: 'black', textAlign: 'center', borderRadius: '5px' }}>Logout</a><br></br>
      </Modal>
      <hr />
    </div>
  );
};

export default UserDashboard;