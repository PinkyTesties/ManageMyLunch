import React, { useEffect, useState } from 'react';
import Header from "./sharedComponents/Header";
import RestaurantPanel from './RestaurantPanel';
import '../style/HomePage.css';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Replace this with the actual API call
    fetch('http://localhost:8082/api/restaurants')
      .then(response => response.json())
      .then(data => setRestaurants(data));
  }, []);

  return (
    <div>
      <Header /> {/* Include Header */}
      <div className="home-page">
        <h1>Welcome to Our Restaurant App</h1>
        <div className="restaurant-list">
          {restaurants.map(restaurant => (
            <RestaurantPanel key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;