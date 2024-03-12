import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RestaurantPanel from './RestaurantPanel';

//Modal allows us to display a layer on top of the whole page

Modal.setAppElement('#root');

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
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
      .get('http://localhost:8082/api/restaurants')
      .then((res) => {
        setRestaurants(res.data);
      })
      .catch((err) => {
        console.log('Error from Dashboard');
      });
  }, []);

  const RestaurantList =
    restaurants.length === 0
      ? 'there are no restaurants'
      : restaurants.map((restaurants, k) => <RestaurantPanel restaurant={restaurants} key={k} />);

  return (
    <div>
      <h1>Manage My Lunch Dashboard</h1>
      <button onClick={toggleDropdown}>Account</button>
      <Modal
        isOpen={showDropdown}
        onRequestClose={toggleDropdown}
        contentLabel="Account Menu"
        style={customStyles}

      >
        <a href="#">Profile</a><br></br>
        <a href="SettingsPage">Settings</a><br></br>
        <a href="#">Logout</a><br></br>
      </Modal>
      <div className='ShowBookList'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12'>
                  <br />
                  <h2 className='display-4 text-center'>Restaurants</h2>
                </div>
      
                <div className='col-md-11'>
                  <Link
                    to='/create-restaurant'
                    className='btn btn-outline-warning float-right'
                  >
                    + Add a Restaurant
                  </Link>
                  <Link
                    to='/delete-restaurant'
                    className='btn btn-outline-warning float-right'
                  >
                    - Remove a Restaurant
                  </Link>
                  <br />
                  <br />
                  <hr />
                </div>
              </div>
      
              {RestaurantList}
            </div>
          </div>

    </div>
  );
};

export default Dashboard;


