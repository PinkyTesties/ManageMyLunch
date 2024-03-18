import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import MenuItemPanel from './MenuItemPanel';
import Modal from 'react-modal';
import logo from './componentAssets/logov1.png';

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
    axios
      .get('http://localhost:8082/api/menuItems')
      .then((res) => {
        setMenuItems(res.data);
      })
      .catch((err) => {
        console.log('Error from ShowRestaurantDetails');
      });
  }, []);

  const MenuItemsList =
    menuItems.length === 0
      ? 'there are no menu items'
      : menuItems.map((menuItem, k) => <MenuItemPanel menuItem={menuItem} key={k} />);

  // const buttonStyles = {
  //   backgroundColor: 'grey',
  //   color: 'white',
  //   borderRadius: '5px',
  //   // add more styles here
  // };

  const RestaurantItem = (
    <div>
      <div className="restaurant-item">
        <div className="item">
          <span className="label">Name: </span>
          <span className="value">{restaurant.restaurantName}</span>
        </div>
        <div className="item">
          <span className="label">Cuisine: </span>
          <span className="value">{restaurant.cuisine}</span>
        </div>
        <div className="item">
          <span className="label">Rating: </span>
          <span className="value">{restaurant.rating}</span>
        </div>
        <div className="item">
          <span className="label">Description: </span>
          <span className="value">{restaurant.description}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <img src={logo} alt='Logo' height={100} />

      <h1>Manage My Lunch Dashboard</h1>

      <button className='header-button' onClick={toggleDropdown}>Account</button>
      <button className='header-button-right'>Cart</button>
      <button className='header-button-right'>Logout</button>

      <Modal
        isOpen={showDropdown}
        onRequestClose={toggleDropdown}
        contentLabel="Account Menu"
        style={customStyles}
      >
        <a href="#">Profile</a><br></br>
        <a href="SettingsPage">Settings</a><br></br>
        <a href="/">Logout</a><br></br>
      </Modal>

      <div className='ShowBookDetails'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-10 m-auto'>
              <br /> <br />
              <Link to='/dashboard' className='btn btn-outline-warning float-left'>
                Back to Restaurants
              </Link>
            </div>
            <br />
            <div className='col-md-8 m-auto'>
              <h1 className='display-4 text-center'>{restaurant.restaurantName}</h1>
              <p className='lead text-center'>*******CSS NOT DONE. DO NOT SUBMIT!</p>
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

              <Link
                to={`/CreateMenuItem/${restaurant._id}`}
                className='btn btn-outline-info btn-lg btn-block'
              //style={buttonStyles}
              >
                Create Menu Item
              </Link>

              <Link
                to={`/DeleteMenuItem/`}
                className='btn btn-outline-info btn-lg btn-block'
              >
                Delete Menu Item
              </Link>
            </div>
            {MenuItemsList}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowRestaurantDetails;
