import React, { useState, useEffect } from 'react';
import logo from "./componentAssets/logov1.png";
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
            <header>
            <img src={logo} alt="Logo" height={100} />
            <h1 className="display-4 text-center">Delete Restaurant</h1>
            <Link to="/dashboard" className="btn btn-outline-warning float-left">
              Show Restaurant List
            </Link>
            </header>
            <hr />
            <div className='delete-user'>
      <form onSubmit={handleRestaurantDelete}>
        <label>Please enter the Restaurant name: </label>
        <input
          type="text"
          value={restaurantName}
          onChange={e => setRestaurantName(e.target.value)}
        />
        <button type="submit">Delete</button>
      </form>
      </div>
      <div className='delete-container'>
      {restaurants.map(restaurant => (
        <div className='delete-item'>
        <div key={restaurant._id}>
          <h2>{restaurant.restaurantName}</h2>
          <p>{restaurant.description}</p>
          <p>{restaurant.cuisine}</p>
          <p>{restaurant.rating}</p>
          <p>{restaurant._id}</p>
        </div>
        </div>
      ))}
      </div>
     
      
    </div>
  );
}

export default DeleteRestaurants;