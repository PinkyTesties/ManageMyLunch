import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantPanel from './RestaurantPanel';
import logo from './componentAssets/logov1.png';
import { backendURL } from './../urls'; // import backendURL from urls.js
import UserDashboard from './UserDashboard'; // Import UserDashboard

Modal.setAppElement('#root');

const Dashboard = ({ history }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [userID, setUserID] = useState('');

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    university: '',
    userID: '',
  });

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
    axios.get(`${backendURL}/`, { withCredentials: true })
      .then((res) => {
        console.log('Server response:', res);
        if (res.data.success && res.data.user) {
          setUserDetails({
            name: res.data.user.name,
            email: res.data.user.email,
            university: res.data.user.university,
            userID: res.data.user.userId,
          });
        } else {
          navigate('/');
        }
      })
      .catch(err => {
        console.log(err);
        navigate('/');
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${backendURL}/api/restaurants`)
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

  //   return (
  //     <div>
  //       <h1>Manage My Lunch Dashboard</h1>
  //       <select value={selectedCuisine} onChange={handleCuisineChange}>
  //         <option value="">All</option>
  //         <option value="BBQ">BBQ</option>
  //         <option value="Healthy">Healthy</option>
  //         <option value="Korean">Korean</option>
  //         {/* Add more options as needed */}
  //       </select>
  //       {RestaurantList}
  //     </div>
  //   );
  // };

  return (
    <div>
            <UserDashboard /> {/* Use UserDashboard */}

      {/* <div className='header'>
        <header className='header'>
          <img src={logo} alt='Logo' height={100} />
          <h1>Manage My Lunch Dashboard</h1>
          <p></p>
        </header>
        <hr />
        <div className='MenuButtons'>
          <button onClick={toggleDropdown}>Account</button>
          <button><Link to="/Reports" style={{ textDecoration: 'none', color: 'Black' }}>Reports</Link></button>
          <button><Link to="/CompleteOrder" style={{ textDecoration: 'none', color: 'Black' }}>Pick Up Order</Link></button>
          <button><Link to="/Cart" style={{ textDecoration: 'none', color: 'Black' }}>Cart</Link></button>
        </div>
      </div> */}
      {/* <Modal
        isOpen={showDropdown}
        onRequestClose={toggleDropdown}
        contentLabel="Account Menu"
        className="my-modal"
      >
        <a href="#">Profile</a><br></br>
        <a href="SettingsPage">Settings</a><br></br>
        <a href="OrderStatus">Orders</a><br></br>

        <a href="/">Logout</a><br></br>
      </Modal>
      <hr /> */}
      <div className='ShowBookList'>

        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <br />

            </div>

            <div className='col-md-11'>
              <div className='restaurantFilter'>
                <h4>Filter by cuisine:</h4><select value={selectedCuisine} onChange={handleCuisineChange}>
                  <option value="">All</option>
                  <option value="BBQ">BBQ</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Korean">Korean</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="American">American</option>
                  <option value="Indian">Indian</option>
                  <option value="Italian">Italian</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </div>





          </div>

        </div>
        <div className='restaurant-cards-container'>
          <div className='rewards'><h2>Rewards</h2></div>
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
        <footer className='restaurant-footer'>
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
        </footer>


      </div>

    </div>
  );
};




export default Dashboard;


