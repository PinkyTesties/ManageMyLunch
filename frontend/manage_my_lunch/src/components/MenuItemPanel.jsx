import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const RestaurantPanel = ({restaurant}) => {

  return (
    <div className='card-container'>
      <img
        src='https://i.kym-cdn.com/entries/icons/facebook/000/043/027/metalpipefalling.jpg'
        alt='Menu Item'
        height={200}
      />
      <div className='desc'>
        <h2>
          <Link to={`/ShowRestaurantDetails/${restaurant._id}`}>{restaurant.restaurantName}</Link>
        </h2>
        <h3>{restaurant.cuisine}</h3>
        <p>{restaurant.description}</p>
      </div>
    </div>
  );
};

export default RestaurantPanel;