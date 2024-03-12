import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

function ShowRestaurantDetails(props) {
  const [restaurant, setRestaurant] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/restaurants/${id}`)
      .then((res) => {
        setRestaurant(res.data);
      })
      .catch((err) => {
        console.log('Error from ShowRestaurantDetails');
      });
  }, [id]);

  const onDeleteClick = (id) => {
    axios
      .delete(`http://localhost:8082/api/restaurants/${id}`)
      .then((res) => {
        navigate('/');
      })
      .catch((err) => {
        console.log('Error form ShowRestaurantDetails_deleteClick');
      });
  };

  const RestaurantItem = (
    <div>
      <table className='table table-hover table-dark'>
        <tbody>
          <tr>
            <th scope='row'>1</th>
            <td>Name</td>
            <td>{restaurant.restaurantName}</td>
          </tr>
          <tr>
            <th scope='row'>2</th>
            <td>Cuisine</td>
            <td>{restaurant.cuisine}</td>
          </tr>
          <tr>
            <th scope='row'>3</th>
            <td>Rating</td>
            <td>{restaurant.rating}</td>
          </tr>
          <tr>
            <th scope='row'>4</th>
            <td>Description</td>
            <td>{restaurant.description}</td>
          </tr>

        </tbody>
      </table>
    </div>
  );

  return (
    <div className='ShowBookDetails'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-10 m-auto'>
            <br /> <br />
            <Link to='/dashboard' className='btn btn-outline-warning float-left'>
              Show restaurant List
            </Link>
          </div>
          <br />
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>restaurant Record</h1>
            <p className='lead text-center'>View restaurant's Info</p>
            <hr /> <br />
          </div>
          <div className='col-md-10 m-auto'>{RestaurantItem}</div>
          <div className='col-md-6 m-auto'>
            <button
              type='button'
              className='btn btn-outline-danger btn-lg btn-block'
              onClick={() => {
                onDeleteClick(restaurant._id);
              }}
            >
              Delete Restaurant
            </button>
          </div>
          <div className='col-md-6 m-auto'>
            <Link
              to={`/UpdateRestaurant/${restaurant._id}`}
              className='btn btn-outline-info btn-lg btn-block'
            >
              Edit restaurant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowRestaurantDetails;
