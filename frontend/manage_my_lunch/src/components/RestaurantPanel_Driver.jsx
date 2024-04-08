import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import "../App.css";

const RestaurantPanel_Driver = ({ restaurant }) => {
  const [completedCarts, setCompletedCarts] = useState([]);

  useEffect(() => {
    const fetchCarts = () => {
      axios.get('http://localhost:8082/api/completedCarts')
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
      axios.put(`http://localhost:8082/api/completedCarts/id/${cart._id}`, { orderStatus: 'Accepted By Driver' })
        .catch(err => console.log(err));
    });
  };



  return (
    <div className="restaurantcard-container">
      <img
        src={`http://localhost:8082/restaurant_assets/${restaurant.RestaurantImage}`}
        alt="Resturants"
        height={200}
      />
      <div className="desc">
        <h2>{restaurant.restaurantName}</h2>
        <h3>{restaurant.address}</h3>
        <p>Orders Available: {completedCarts.length}</p><br></br>
        <br></br>
        <button onClick={handleSelectAll}>Select All</button>
      </div>
    </div>
  );
};

export default RestaurantPanel_Driver;
