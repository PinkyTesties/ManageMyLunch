/**
RestaurantPanel.jsx

This component is used to display the restaurant's name, description, and rating as a panel in the dashboard page.

Created by Tyler Costa 19075541

 */

//React imports
import React from 'react';
import { Link } from 'react-router-dom';
//Styles
import '../App.css';
import '../style/RestaurantPanel.css';

const RestaurantPanel = ({ restaurant }) => {

  //Render the restaurant panel, its very simple and only displays the restaurant's image, name, description, and rating
  return (
    <div className='restaurantcard-container'>
      <div className='item'>
      <Link to={`/ShowRestaurantDetails/${restaurant._id}`}>
      <img
        src={`http://localhost:8082/restaurant_assets/${restaurant.RestaurantImage}`}
        alt='Restaurants'
        height={200}
      />
      </Link>
      <div className='title'>
      <b>{restaurant.restaurantName}</b>
      </div>
      <hr></hr>
      </div>
      <p>{restaurant.description}</p>
      <p>Rating: {restaurant.rating} stars</p>
    </div>
  );
};

export default RestaurantPanel;