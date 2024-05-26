/*
Driver_OrderPanel.jsx
This is a child component of the DriverDashboard.jsx page. This component is used to display the order details to the driver.
The driver can accept the order from this page. It will also send an email to the customer to notify them that the order has been accepted.

Created by Tyler Costa 19075541
*/

//React imports
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

//EmailJS import
import emailjs from 'emailjs-com';
//Styles
import '../style/orderPanel.css';

const Driver_OrderPanel = ({ order, email }) => {
  //Variables
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [university, setUniversity] = useState('');
  const [message, setMessage] = useState('');

  //Fetch restaurant address and assign to variable
  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/restaurants/${order.restaurant_id}`)
      .then((res) => {
        setRestaurantAddress(res.data.address);
      })
      .catch((err) => {
        console.log('Error fetching restaurant');
      });

    // Fetch customer uni by using customers email and set university
    axios
      .get(`http://localhost:8082/api/users/email/${order.email}`)
      .then((res) => {
        setUniversity(res.data.university);
      })
      .catch((err) => {
        console.log('Error fetching user');
      });
  }, [order]);

  //Function to accept the order
  const acceptOrder = () => {
    axios
      //Update the order status to 'Accepted By Driver'
      .put(`http://localhost:8082/api/completedCarts/status/${order._id}`, { orderStatus: 'Accepted By Driver', driver_email: email })
      .then((res) => {
        console.log('Order accepted');
        // Fetch driver's name after accepting the order
        return axios.get(`http://localhost:8082/api/drivers/email/${email}`);
      })
      .then((res) => {
        // Get the driver's name
        const driverName = res.data.name;
        // Call sendEmail and pass the driver's name
        sendEmail(driverName);
      })
      .catch((err) => {
        console.log('Error:', err.message);
      });
  };

  const sendEmail = async (driverName) => {
    // Fetch user's email preference
    const fetchUserEmailPreference = async (email) => {
      const response = await fetch(`http://localhost:8082/api/users/email/${email}`);
      const data = await response.json();
      return data.emailAfterDriverAcceptance;
    };
  
    const emailAfterDriverAcceptance = await fetchUserEmailPreference(order.email);
  
    // If user does not want to receive emails, return
    if (!emailAfterDriverAcceptance) {
      return;
    }
  
    // Email contents with driver name
    const emailParams = {
      email_from: order.email,
      message:
        "Hey there " + order.customerName + ", " +
        "Your order from " + order.restaurant_name + " has been accepted by one of our drivers!\n\n" +
        "Your order will be delivered by " + driverName + " to " + university + " today, we will let you know once its on the way and again once delivered. \n\n" +
        "Log in to Manage My Lunch at any time to view your order. \n\n"
    };
  
    // Send the email using the emailJS api keys
    emailjs.send('service_gmcskkn', 'template_v78bl21', emailParams, 'XfgsvummwbkF3G1dV')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
        console.log('FAILED...', err);
      });
  };
  //Render the order details to the container which is then rendered in the DriverDashboard
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
        <br></br>
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