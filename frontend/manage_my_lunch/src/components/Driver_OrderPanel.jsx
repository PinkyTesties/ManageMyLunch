import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Driver_css_temp.css';


const Driver_OrderPanel = ({ order }) => {
  const [restaurantAddress, setRestaurantAddress] = useState(''); // Initialize state variable
  const [university, setUniversity] = useState(''); // Initialize university state variable

  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/restaurants/${order.restaurant_id}`)
      .then((res) => {
        setRestaurantAddress(res.data.address);
      })
      .catch((err) => {
        console.log('Error fetching restaurant');
      });

    axios
      .get(`http://localhost:8082/api/users/email/${order.email}`) // Fetch user by email
      .then((res) => {
        setUniversity(res.data.university); // Set university state variable
      })
      .catch((err) => {
        console.log('Error fetching user');
      });
  }, [order]);

  const acceptOrder = () => {
    axios
      .put(`http://localhost:8082/api/completedCarts/status/${order._id}`, { orderStatus: 'Accepted By Driver' })
      .then((res) => {
        console.log('Order accepted');
      })
      .catch((err) => {
        console.log('Error accepting order');
      });
  };
  

  return (
    <div className='order-container'>
      <h2>Order From {order.restaurant_name}</h2>
      <p>Order id: {order._id}</p>
      <p>Restaurant ID: {order.restaurant_id}</p>
      <p>Restaurant Location: {restaurantAddress}</p>
      <p>Number of items: {order.menuItems.length}</p>
      <br></br>
      <h3>Customer details:</h3>
      <p>Contact: {order.email}</p>
      <p>Delivery location: {university}</p>
      <br></br>
      <button onClick={acceptOrder}>
    Select Order
  </button>
    </div>
  );
};

export default Driver_OrderPanel;