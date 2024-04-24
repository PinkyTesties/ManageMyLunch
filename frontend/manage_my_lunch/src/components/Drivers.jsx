import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from './componentAssets/logov1.png';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    axios
      .get('http://localhost:8082/api/drivers')
      .then((res) => setDrivers(res.data))
      .catch((err) => console.log(err));
  };

  const deleteDriver = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:8082/api/drivers/${id}`)
        .then((res) => {
          alert(res.data.msg);
          fetchDrivers(); // Refresh the drivers list after deletion
        })
        .catch((err) => alert(err.response.data.error));
    }
  };



  const boxStyle = {
    border: '1px solid black',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
  };

  return (
    <div>
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
          <button onClick={() => deleteDriver(driver._id)}>Delete Driver</button>
          <button onClick={console.log("This is where the driver tracker is ")/*   () => deleteDriver(driver._id)*/}>
            Track Driver</button>
        </div> 
      ))}
      </div>
    </div>
  );
};

export default Drivers;