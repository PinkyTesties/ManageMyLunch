import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const RestaurantPanel = ({restaurant}) => {

  return (
    <div className='card-container'>
      <img
        src='https://images.unsplash.com/photo-1495446815901-a7297e633e8d'
        alt='Resturants'
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