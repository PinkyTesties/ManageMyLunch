import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import '../style/orderPanel.css'; // Make sure to create and import this CSS file
import axios from 'axios';


const Driver_OrderPanel = ({ order, email }) => {
  const [restaurantAddress, setRestaurantAddress] = useState(''); // Initialize state variable
  const [university, setUniversity] = useState(''); // Initialize university state variable
  //const [email, setEmail] = useState("");
  const [message, setMessage] = useState(''); //this is the email message

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
      .put(`http://localhost:8082/api/completedCarts/status/${order._id}`, { orderStatus: 'Accepted By Driver', driver_email: email })
      .then((res) => {
        console.log('Order accepted');
        // Fetch driver's name after accepting the order
        return axios.get(`http://localhost:8082/api/drivers/email/${email}`);
      })
      .then((res) => {
        const driverName = res.data.name; // Assuming the driver's name is stored in the 'name' field
        sendEmail(driverName); // Call sendEmail with the driver's name
      })
      .catch((err) => {
        console.log('Error:', err.message);
      });
  };
  
  const sendEmail = (driverName) => {
    // Send email to customer
    const emailParams = {
      email_from: order.email,
      message: 
      "Hey there "+ order.customerName + ", "+
      "Your order from " + order.restaurant_name +" has been accepted by one of our drivers!\n\n" +
      "Your order will be delivered by "+ driverName +" to "+university + " today, we will let you know once its on the way and again once delivered. \n\n" +
      "Log in to Manage My Lunch at any time to view your order. \n\n"
    };
  
    emailjs.send('service_gmcskkn', 'template_v78bl21', emailParams, 'XfgsvummwbkF3G1dV')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
        console.log('FAILED...', err);
      });
  };


  return (
    <div>
      <br></br>
    <div className='order-container'>
      
      <h2>Order From {order.restaurant_name}</h2>
      <p>Order id: {order._id}</p>
      <p>Restaurant Location: {restaurantAddress}</p>
      <p>Number of items: {order.menuItems.length}</p>
      <br></br>
      <h3>Customer details:</h3>
      <p>Contact: {order.email}</p>
      <p>Delivery location: {order.delivery_location}</p>
      <p>Driver email: {email}</p>
      <br></br>
      <button onClick={acceptOrder}>
    Select Order
  </button>
  <hr />
    </div>
    </div>
  );
};

export default Driver_OrderPanel;