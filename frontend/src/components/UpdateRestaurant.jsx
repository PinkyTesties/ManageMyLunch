/*
UpdateRestaurant.jsx

This is the update restaurant page that allows the admin to update the restaurant details
Currently only the name can be edited, but this can be easily expanded to update other details of the restaurant

Created by Tyler Costa 19075541
*/

//React imports
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import logo from "./componentAssets/logov1.png";
import axios from 'axios';
//Header
import UserDashboard from './UserDashboard';
//Footer
import Footer from './sharedComponents/Footer';
//Styles
import '../style/UpdateRestaurant.css';

function UpdateRestaurant(props) {
  //Variables
  const [restaurant, setRestaurant] = useState({
    restaurantName: '',
    cuisine: '',
    rating: '',
    description: '',

  });

  const { id } = useParams();
  const navigate = useNavigate();

  //Fetch the restaurant details
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

  //Function to handle the input fields change
  const onChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  //Function to handle the form submission
  const onSubmit = (e) => {
    e.preventDefault();

    //Create the restaurant object
    const data = {
      restaurantName: restaurant.restaurantName,
      cuisine: restaurant.cuisine,
      rating: restaurant.cuisine,
      description: restaurant.description,

    };

    //Update the restaurant details
    axios
      .put(`http://localhost:8082/api/restaurants/${id}`, data)
      .then((res) => {
        navigate(`/ShowRestaurantDetails/${id}`);
      })
      .catch((err) => {
        console.log('Error in UpdateRestaurant!');
      });
  };

  //Return the update restaurant form
  return (
<<<<<<< HEAD
    <div className='UpdateBookInfo'>
      <header>
            <img src={logo} alt="Logo" height={100} />
            <h1>Add Restaurant</h1>
            <Link to="/dashboard" className="btn btn-outline-warning float-left">
              Show Restaurant List
            </Link>
            </header>
            <hr />
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 m-auto'>

          </div>
        </div>

        <div className='row'>
          <div className='col-md-8 m-auto'>
            <p className='lead text-center'>Update <b>{restaurant.restaurantName}</b> info</p>
            <div className='delete-user'>
            <form noValidate onSubmit={onSubmit}>
              <div className='form-group'>
                <label htmlFor='title'>Name</label>
                <input
                  type='text'
                  placeholder='Name of the restaurant'
                  name='restaurantName'
                  className='form-control'
                  value={restaurant.restaurantName}
                  onChange={onChange}
                />
              </div>
              
              <br />
              {/* Add other form fields similarly */}
              <button
                type='submit'
                className='btn btn-outline-info btn-lg btn-block'
              >
                Update restaurant
              </button>
            </form>
            </div>
          </div>
=======
    <div>
      {/*Header*/}
      <UserDashboard />
      <div className='update-restaurant-container'>

        {/*Button to show the restaurant list*/}
        <button onClick={() => navigate('/dashboard')} className='dashboard-button'>
          Show restaurant List
        </button>

        <div className='update-restaurant-content'>
          <h1 className='title'>Edit restaurant</h1>
          <p className='subtitle'>Update restaurant's Info</p>

          {/*Form to update the restaurant details*/}
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
>>>>>>> origin/main
        </div>
      </div>
      {/*Footer*/}
      <Footer />
    </div>
  );
}

export default UpdateRestaurant;
