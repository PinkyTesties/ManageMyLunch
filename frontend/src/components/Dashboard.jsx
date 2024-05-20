import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantPanel from './RestaurantPanel';
import logo from './componentAssets/logov1.png';
import '../style/Dashboard.css';
import Footer from '../components/sharedComponents/Footer';

Modal.setAppElement('#root');

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [userID, setUserID] = useState('');

  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    axios.get('http://localhost:8082')
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          setUniversity(res.data.university);
          setUserID(res.data._id);
        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err))
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8082/api/restaurants')
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.log('Error from Dashboard'));
  }, []);

  const handleCuisineChange = (cuisine) => setSelectedCuisine(cuisine);

  const filteredRestaurants = restaurants.filter(
    (restaurant) => selectedCuisine === '' || restaurant.cuisine === selectedCuisine
  );

  const RestaurantList = filteredRestaurants.map((restaurant, k) => (
    <RestaurantPanel restaurant={restaurant} key={k} />
  ));

  return (
    <div className='dashboard'>
      {/* Header */}
      <header className='dashboard-header'>
        <h1 className='title'>Manage My Lunch Dashboard</h1>
        <p className='user-info'>Logged in as: {name}, {university}</p>
        <div className='menu-buttons'>
          <button onClick={toggleDropdown} className='account-button'>Account</button>
          <Link to="/Reports"><button className='reports-button'>Reports</button></Link>
          <Link to="/CompleteOrder"><button className='order-button'>Pick Up Order</button></Link>
          <Link to="/Cart"><button className='cart-button'>Cart</button></Link>
        </div>
      </header>

      {/* Account Modal */}
      <Modal
        isOpen={showDropdown}
        onRequestClose={toggleDropdown}
        contentLabel="Account Menu"
        className="account-modal"
      >
        <a href="#">Profile</a><br></br>
        <a href="SettingsPage">Settings</a><br></br>
        <a href="OrderStatus">Orders</a><br></br>
        <a href="/">Logout</a><br></br>
      </Modal>

      {/* Restaurant List */}
      <div className='restaurant-list'>
        {/* Filter by Cuisine */}
        <div className='filter-container'>
          {['All', 'BBQ', 'Healthy', 'Korean', 'Chinese', 'Japanese', 'American', 'Indian', 'Italian'].map((cuisine) => (
            <button
              key={cuisine}
              className={`filter-button ${selectedCuisine === cuisine ? 'active' : ''}`}
              onClick={() => handleCuisineChange(cuisine === 'All' ? '' : cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {/* Restaurant Cards */}
        <div className='restaurant-cards'>
          <h2 className='rewards-title'>Rewards</h2>
          {RestaurantList.length === 0 ? (
            <div className='alert alert-warning' role='alert'>
              No restaurants found.
            </div>
          ) : (
            <div className='restaurant-row'>
              {RestaurantList}
            </div>
          )}
          <Link to='/create-restaurant' className='add-restaurant-button'>
            + Add a Restaurant
          </Link>
          <Link to='/delete-restaurant' className='remove-restaurant-button'>
            - Remove a Restaurant
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
