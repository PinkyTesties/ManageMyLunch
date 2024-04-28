import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { backendURL } from './../urls'; // import backendURL from urls.js

import "../App.css";

const RestaurantPanel_Driver = ({ restaurant }) => {
  const [completedCarts, setCompletedCarts] = useState([]);

  useEffect(() => {
    const fetchCarts = () => {
      axios.get(`${backendURL}/api/completedCarts`)
        .then(res => {
          const carts = res.data.filter(cart => 
            cart.restaurant_id === restaurant._id && cart.orderStatus === "Pending"
          );
          setCompletedCarts(carts);
        })
        .catch(err => console.log(err));
    };
  
    fetchCarts(); // Fetch carts immediately when the component mounts
    const intervalId = setInterval(fetchCarts, 1000); // Fetch carts every 2 seconds
  
    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, [restaurant]);

  const handleSelectAll = () => {
    completedCarts.forEach(cart => {
      axios.put(`${backendURL}/api/completedCarts/id/${cart._id}`, { orderStatus: 'Accepted By Driver' })
        .catch(err => console.log(err));
    });
  };



  return (
    <div className="restaurantcard-container-driver">
      <img
        src={`${backendURL}/restaurant_assets/${restaurant.RestaurantImage}`}
        alt="Resturants"
        height={200}
      />
      <div className="desc-driver">
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
