/**
RestaurantPanel_Driver.jsx

This is similar to the RestaurantPanel component, but it is specifically for the driver.
It displays the restaurant's name, address, and the number of orders available for the driver to accept.
The driver can also select to pick up all the orders currently available for the restaurant.

It renders the restaurant panel for the driver in the driverDashboard page.

Created by: Tyler Costa 19075541
 */

//React imports
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

//Styles
import "../App.css";

const RestaurantPanel_Driver = ({ restaurant }) => {
  //Variables
  const [completedCarts, setCompletedCarts] = useState([]);

  //Fetches the carts that are completed and pending for the restaurant
  useEffect(() => {
    const fetchCarts = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      axios.get('http://localhost:8082/api/completedCarts')
        .then(res => {
          const carts = res.data.filter(cart => {
            const cartDate = new Date(cart.delivery_date);
            cartDate.setHours(0, 0, 0, 0);
            // Check if the cart is for the correct restaurant and is pending
            return cart.restaurant_id === restaurant._id && cart.orderStatus === "Pending" && cartDate.getTime() === today.getTime();
          });
          setCompletedCarts(carts);
        })
        .catch(err => console.log(err));
    };
  
    // Fetch the carts every second
    fetchCarts(); 
    const intervalId = setInterval(fetchCarts, 1000); 
  
    return () => clearInterval(intervalId);
  }, [restaurant]);

  //Function to handle selecting all the orders for the restaurant
  const handleSelectAll = () => {
    completedCarts.forEach(cart => {
      // Update the order status to "Accepted By Driver"
      axios.put(`http://localhost:8082/api/completedCarts/id/${cart._id}`, { orderStatus: 'Accepted By Driver' })
        .catch(err => console.log(err));
    });
  };

  //Render the restaurant panel
  return (
    <div className="restaurantcard-container-driver">
      <img
        src={`http://localhost:8082/restaurant_assets/${restaurant.RestaurantImage}`}
        alt="Resturants"
        height={200}
      />
      <div className="desc-driver">
        {/**Restaurant Details */}
        <b>{restaurant.restaurantName}</b>
        <hr />
        <p>{restaurant.address}</p>
        <p>Orders Available: {completedCarts.length}</p><br></br>
        <button onClick={handleSelectAll}>Select All</button>
      </div>
    </div>
  );
};

export default RestaurantPanel_Driver;