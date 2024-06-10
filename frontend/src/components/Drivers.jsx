/*
Drivers.jsx
This file is used to display the drivers in the system. The admin can delete drivers from this page. The admin can also view the reviews for the driver.

In a future release, the admin will be able to track the driver's location from this page.

Created by Tyler Costa 19075541

*/

//React imports
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import logo from './componentAssets/logov1.png';
=======
//Header
import UserDashboard from './UserDashboard';
//Footer
import Footer from './sharedComponents/Footer';
//Styles
import '../style/Drivers.css';
>>>>>>> origin/main

const Drivers = () => {
  //Variables
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  //Fetch the drivers
  useEffect(() => {
    fetchDrivers();
  }, []);

  //Fetch the drivers
  const fetchDrivers = () => {
    axios
      .get('http://localhost:8082/api/drivers')
      .then((res) => setDrivers(res.data))
      .catch((err) => console.log(err));
  };

  //Function to delete a driver
  const deleteDriver = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:8082/api/drivers/${id}`)
        .then((res) => {
          alert(res.data.msg);
          // Refresh the drivers list after deletion
          fetchDrivers(); 
        })
        .catch((err) => alert(err.response.data.error));
    }
  };

  //Function to view the driver reviews
  const viewDriverReview = (email) => {
    navigate(`/ViewDriverReviews/${email}`);
  };

  //This is the box that the driver details will be displayed in
  const boxStyle = {
    border: '1px solid black',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
  };

  //Render the drivers to the page
  return (
    <div>
<<<<<<< HEAD
      <header>
      <img src={logo} alt='Logo' height={100} />
      <h1>Drivers</h1>
      <p></p>
      </header>
      <div className='MenuButtons'>
      <button><Link to={'/AddDriver'} style={{ textDecoration: 'none', color: 'Black' }}>Add Drivers</Link></button>
      <button><Link to={'/Dashboard'} style={{ textDecoration: 'none', color: 'Black' }}>Dashboard</Link></button>
      </div>
      <div className='driver-item'>
      {drivers.map((driver) => (
        <div className='drivers' key={driver._id} style={boxStyle}>
          <h2>{driver.name}</h2>
          <p>Email: {driver.email}</p>
          <p>Date Added: {new Date(driver.date_added).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(driver.updated_date).toLocaleDateString()}</p>
          <p>Current wallet balance: ${driver.wallet_balance}</p>
          <button onClick={() => deleteDriver(driver._id)}>Delete Driver</button>
          <button onClick={() => viewDriverReview(driver.email)}>View Reviews</button>

          <button onClick={console.log("This is where the driver tracker is ")/*   () => deleteDriver(driver._id)*/}>
            Track Driver</button>
        </div> 
      ))}
      </div>
=======
       {/*Header */}
      <UserDashboard />

      <h1>Current Drivers for Manage My Lunch</h1>
      <button className='driverButton' onClick={() => navigate('/AddDriver')}>Add a Driver</button>
      <div className='driverContainer'>
        {drivers.map((driver) => (
          <div key={driver._id} style={boxStyle}>
            <h2>{driver.name}</h2>
            <p>Email: {driver.email}</p>
            <p>Date Added: {new Date(driver.date_added).toLocaleDateString()}</p>
            <p>Current wallet balance: ${driver.wallet_balance.toFixed(2)}</p>
            <button className='deleteDriverButton' onClick={() => deleteDriver(driver._id)}>Delete Driver</button>
            <button className='driverButton' onClick={() => viewDriverReview(driver.email)}>View Reviews</button>

            <button className='driverButton' onClick={console.log("This is track driver button ")}>
              Track Driver</button>

          </div>
        ))}
      </div>
      {/*Footer */}
      <Footer />
>>>>>>> origin/main
    </div>
  );
};

export default Drivers;