import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import logo from "./componentAssets/logov1.png";
import axios from 'axios';
import '../App.css';

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
        </div>
      </div>
    </div>
  );
}

export default UpdateRestaurant;
