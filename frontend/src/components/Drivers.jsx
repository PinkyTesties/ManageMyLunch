import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import '../style/Drivers.css';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

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

  const viewDriverReview = (email) => {
    navigate(`/ViewDriverReviews/${email}`);
  };

  const boxStyle = {
    border: '1px solid black',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
  };

  return (
    <div>
      <UserDashboard /> {/* Use UserDashboard */}

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

          <button className='driverButton' onClick={console.log("This is where the driver tracker is ")/*   () => deleteDriver(driver._id)*/}>
            Track Driver</button>

        </div>
      ))}
      </div>
    </div>
  );
};

export default Drivers;