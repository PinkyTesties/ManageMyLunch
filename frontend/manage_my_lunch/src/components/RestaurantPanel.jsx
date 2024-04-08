import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const RestaurantPanel = ({ restaurant }) => {

  return (
    <div className='restaurantcard-container'>
      <img
        src={`http://localhost:8082/restaurant_assets/${restaurant.RestaurantImage}`}
        alt='Resturants'
        height={200}
      />
      <div className='desc'>
        <h2>
          <Link to={`/ShowRestaurantDetails/${restaurant._id}`}>{restaurant.restaurantName}</Link>
        </h2>
        <h2>Rating: {restaurant.rating} stars</h2><br></br>
      </div>
      <h3>{restaurant.cuisine}</h3>
      <p>{restaurant.description}</p>
      <button><Link to={`/ShowRestaurantDetails/${restaurant._id}`} style={{ textDecoration: 'none', color: 'Black' }}>View</Link></button>
    </div>
  );
};

export default RestaurantPanel;