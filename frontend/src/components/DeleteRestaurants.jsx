/*
THIS IS NO LONGER USED IN THE APPLICATION. IT WAS REPLACED BY THE DELETE BUTTON IN THE DASHBOARD.

*/

import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function DeleteRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    fetch('http://localhost:8082/api/restaurants')
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(error => console.error('Error fetching restaurants:', error));
  }, []);

  const handleRestaurantDelete = (event) => {
    event.preventDefault();

    const restaurant = restaurants.find(restaurant => restaurant.restaurantName === restaurantName);

    if (restaurant) {
      fetch(`http://localhost:8082/api/restaurants/${restaurant._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setRestaurants(restaurants.filter(restaurant => restaurant.restaurantName !== restaurantName));
        setRestaurantName('');
        alert("Restaurant successfully deleted");
      })
      .catch(error => console.error('Error deleting restaurant:', error));
    } else {
      alert("No restaurant found");
    }
  };

  return (
    <div>
            <Link to="/dashboard" className="btn btn-outline-warning float-left">
              Show Restaurant List
            </Link>
      <form onSubmit={handleRestaurantDelete}>
        <input
          type="text"
          placeholder="Type a restaurant name"
          value={restaurantName}
          onChange={e => setRestaurantName(e.target.value)}
        />
        <button type="submit">Delete</button>
      </form>
      {restaurants.map(restaurant => (
        <div key={restaurant._id}>
          <h2>{restaurant.restaurantName}</h2>
          <p>{restaurant.description}</p>
          <p>{restaurant.cuisine}</p>
          <p>{restaurant.rating}</p>
          <p>{restaurant._id}</p>
        </div>
      ))}
    </div>
  );
}

export default DeleteRestaurants;