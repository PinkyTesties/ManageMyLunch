import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantPanel from './RestaurantPanel';
import UserDashboard from './UserDashboard'; // Import UserDashboard (header) 

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8082/api/restaurants')
      .then((res) => {
        setRestaurants(res.data);
      })
      .catch((err) => {
        console.log('Error from Dashboard');
      });
  }, []);

  const handleCuisineChange = (event) => {
    setSelectedCuisine(event.target.value);
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) => selectedCuisine === '' || restaurant.cuisine === selectedCuisine
  );

  const RestaurantList = filteredRestaurants.map((restaurant, k) => (
    <RestaurantPanel restaurant={restaurant} key={k} />
  ));

  const CuisineOptions = ['BBQ', 'Healthy', 'Korean', 'Chinese', 'Japanese', 'American', 'Indian', 'Italian'];

  return (
    <div>
      <UserDashboard /> {/* Use UserDashboard */}
      <div className='restaurantFilter'>
        <h4>Filter by cuisine:</h4>
        <select value={selectedCuisine} onChange={handleCuisineChange}>
          <option value="">All</option>
          {CuisineOptions.map(cuisine => <option value={cuisine} key={cuisine}>{cuisine}</option>)}
        </select>
      </div>
      <div className='ShowBookList'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <br />
              <h2 className='display-4 text-center'>Restaurants</h2>
            </div>
            <div className='col-md-11'>
              <br />
              <br />
              <hr />
            </div>
          </div>
        </div>
        <div className='restaurant-cards-container'>
          {RestaurantList.length === 0 ? (
            <div className='alert alert-warning' role='alert'>
              No restaurants found.
            </div>
          ) : (
            <div className='row'>
              {RestaurantList}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;