import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import MenuItemPanel from './MenuItemPanel';
import Modal from 'react-modal';
import UserDashboard from './UserDashboard'; // Import UserDashboard

Modal.setAppElement('#root');

function ShowRestaurantDetails(props) {
  const [restaurant, setRestaurant] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const customStyles = {
    content: {
      top: '0%',
      right: '0%',
      bottom: 'auto',
      left: 'auto',
      width: '20%',
      height: '50%',
    },
  };

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

  useEffect(() => {
    console.log('Fetching menu items for restaurant_id:', id);

    axios.get(`http://localhost:8082/api/menuItems?restaurant_id=${id}`)
      .then((res) => {
        setMenuItems(res.data);
      })
      .catch((err) => {
        console.log('Error from ShowRestaurantDetails', err);
      });
  }, [id]);

  const MenuItemsList =
    menuItems.length === 0
      ? 'there are no menu items'
      : menuItems.map((menuItem, k) => <MenuItemPanel menuItem={menuItem} key={k} />);

  const RestaurantItem = (
    <div>
      <div className="restaurant-details">
        <div className='restaurant-info'>
          <div className="back-button">
          <Link to='/dashboard' className='btn btn-outline-warning float-left'>
            Back to Restaurants
          </Link>
          </div>
          <div className="empty-item">
          </div>
          <div className="empty-item">
          </div>
        </div>
        <div className="rating-description">
        <h5>Google Rating: </h5>
            <span className="rating-value">{restaurant.rating} Stars </span>
            <br />
            <br />
            <b>{restaurant.description}</b>
        </div>
        <Link to={`/ViewRestaurantReviews/${restaurant._id}`} className="review-link">View Restaurant reviews</Link>
      </div>
    </div>
  );

  return (
    <div>
      <UserDashboard /> {/* Use UserDashboard */}
      <div className='restaurant-details-container'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-10 m-auto'>
            </div>
            <br />
            <div className='col-md-8 m-auto'>
              <h1 className='restaurant-name'>{restaurant.restaurantName}</h1>
              <br /> <br />
            </div>
            <div className='col-md-10 m-auto'>{RestaurantItem}</div>
            <div className="button-container">
              <div className='col-md-6 m-auto'>
              </div>
              <div className='col-md-6 m-auto'>
              </div>
            </div>
            {MenuItemsList}
          </div>
        </div >

        <div className='action-buttons'>
          <Link
            to={`/CreateMenuItem/${restaurant._id}`}
            className='btn btn-outline-info btn-lg btn-block'
          >
            Create Menu Item
          </Link>
          <Link
            to={`/UpdateRestaurant/${restaurant._id}`}
            className='btn btn-outline-info btn-lg btn-block'
          >
            Edit restaurant
          </Link>
          <Link
            to={`/DeleteMenuItem/`}
            className='btn btn-outline-info btn-lg btn-block'
          >
            Delete Menu Item
          </Link>
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
      </div>
    </div>
  );
}

export default ShowRestaurantDetails;