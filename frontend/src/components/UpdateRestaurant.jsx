import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboard from './UserDashboard';
import Footer from './sharedComponents/Footer';
import '../style/UpdateRestaurant.css';

function UpdateRestaurant(props) {
  const [restaurant, setRestaurant] = useState({
    restaurantName: '',
    cuisine: '',
    rating: '',
    description: '',

  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/restaurants/${id}`)
      .then((res) => {
        setRestaurant({
          restaurantName: res.data.restaurantName,
          cuisine: res.data.cuisine,
          rating: res.data.rating,
          description: res.data.description,

        });
      })
      .catch((err) => {
        console.log('Error from UpdateRestaurant');
      });
  }, [id]);

  const onChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      restaurantName: restaurant.restaurantName,
      cuisine: restaurant.cuisine,
      rating: restaurant.cuisine,
      description: restaurant.description,

    };

    axios
      .put(`http://localhost:8082/api/restaurants/${id}`, data)
      .then((res) => {
        navigate(`/ShowRestaurantDetails/${id}`);
      })
      .catch((err) => {
        console.log('Error in UpdateRestaurant!');
      });
  };

  return (
    <div>
      <UserDashboard />
    <div className='update-restaurant-container'>

<button onClick={() => navigate('/dashboard')} className='dashboard-button'>
  Show restaurant List
</button>

  <div className='update-restaurant-content'>
    <h1 className='title'>Edit restaurant</h1>
    <p className='subtitle'>Update restaurant's Info</p>

    <form noValidate onSubmit={onSubmit} className='update-form'>
      <div className='form-group'>
        <label htmlFor='title'>Name</label>
        <input
          type='text'
          placeholder='Name of the restaurant'
          name='restaurantName'
          className='form-input'
          value={restaurant.restaurantName}
          onChange={onChange}
        />
      </div>
      {/* Add other form fields similarly */}
      <button
        type='submit'
        className='submit-button'
      >
        Update restaurant
      </button>
    </form>
    <br></br>
    <br></br>
    <br></br>
  </div>
</div>
<Footer />
</div>
  );
}

export default UpdateRestaurant;
