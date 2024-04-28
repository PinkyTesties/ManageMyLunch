import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { backendURL } from './../urls'; // import backendURL from urls.js

const RestaurantPanel = ({ restaurant }) => {

  return (
    <div className='restaurantcard-container'>
      <div className='item'>
      <Link to={`/ShowRestaurantDetails/${restaurant._id}`}>
      <img
        src={`${backendURL}/restaurant_assets/${restaurant.RestaurantImage}`}
        alt='Restaurants'
        height={200}
      />
      </Link>
      <b>{restaurant.restaurantName}</b>
      <hr></hr>
      </div>
      <p>{restaurant.description}</p>
      <p>Rating: {restaurant.rating} stars</p>
    </div>
  );
};

export default RestaurantPanel;