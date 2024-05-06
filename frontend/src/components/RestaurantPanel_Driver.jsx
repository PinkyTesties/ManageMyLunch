import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import "../App.css";

const RestaurantPanel_Driver = ({ restaurant }) => {
  const [completedCarts, setCompletedCarts] = useState([]);

  useEffect(() => {
    const fetchCarts = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison

      axios.get('http://localhost:8082/api/completedCarts')
        .then(res => {
          const carts = res.data.filter(cart => {
            const cartDate = new Date(cart.delivery_date);
            cartDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison
            return cart.restaurant_id === restaurant._id && cart.orderStatus === "Pending" && cartDate.getTime() === today.getTime();
          });
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
    <div className="restaurantcard-container-driver">
      <img
        src={`http://localhost:8082/restaurant_assets/${restaurant.RestaurantImage}`}
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