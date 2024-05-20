import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantPanel from './RestaurantPanel';
import logo from './componentAssets/logov1.png';
Modal.setAppElement('#root');

const Dashboard = ({ history }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [userID, setUserID] = useState('');
  const [userRewardPoints, setUserRewardPoints] = useState(0);

  const navigate = useNavigate();

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
    axios.get('http://localhost:8082')
      .then((res) => {


        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          console.log('Email:', res.data.email);
          setUniversity(res.data.university);
          //setUserID(res.data.userId);
          //req.session.userId

        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err))
  }, [])

  const [activeRewards, setActiveRewards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8082/api/rewards/active')
      .then(response => response.json())
      .then(data => {
        const rewardsData = data.map(reward => ({ id: reward._id, code: reward.code, points: reward.points, message: reward.message, title: reward.title }));
        setActiveRewards(rewardsData);
        console.log('Active rewards:', rewardsData); // log active rewards to console
      })
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (email) { // Only make the request if email is defined
      axios.get(`http://localhost:8082/api/users/email/${email}`)
        .then(response => {
          setUserID(response.data._id);
          console.log('User ID:', response.data._id);
        })
        .catch(error => console.error('Error:', error));
    }
  }, [email]); // Run this effect when the email state changes

  useEffect(() => {
    axios.get(`http://localhost:8082/api/users/${userID}`)
      .then(response => {
        setUserRewardPoints(response.data.rewardsPoints);
        console.log('User reward points:', response.data.rewardsPoints);
      })
      .catch(error => console.error('Error:', error));
  }, [userID]);

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


  const [eligibleRewards, setEligibleRewards] = useState([]);

  useEffect(() => {
    const filteredRewards = activeRewards.filter(
      (reward) => reward.points <= userRewardPoints
    );
    console.log('Eligible rewards:', filteredRewards);
    setEligibleRewards(filteredRewards);
  }, [activeRewards, userRewardPoints]);

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
      {

      }
      <div className='header'>
        <header className='header'>
          <img src={logo} alt='Logo' height={100} />
          <h1>Manage My Lunch Dashboard</h1>
          <p></p>
        </header>
        <hr />
        <p>Logged in as: {name}, {university}</p>
        <div className='MenuButtons'>
          <button onClick={toggleDropdown}>Account</button>
          <button><Link to="/Dashboard" style={{ textDecoration: 'none', color: 'Black' }}>Dashboard</Link></button>
          <button><Link to="/OrderStatus" style={{ textDecoration: 'none', color: 'Black' }}>Orders</Link></button>

          <button><Link to="/Reports" style={{ textDecoration: 'none', color: 'Black' }}>Reports</Link></button>
          <button><Link to="/CompleteOrder" style={{ textDecoration: 'none', color: 'Black' }}>Pick Up Order</Link></button>
          <button><Link to="/Cart" style={{ textDecoration: 'none', color: 'Black' }}>Cart</Link></button>
        </div>
      </div>
      <Modal
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
      <hr />
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
          <div className='rewards'><h2>Rewards</h2>

            {eligibleRewards.map((reward, index) => (
              <div key={index}>
                <div className='reward-box'>
                  <h4>{reward.title}</h4>
                  <p>{reward.message}</p>
                  <p className="reward-code"><b>Use code <i>{reward.code}</i> at checkout</b></p>

                </div>
              </div>
            ))}

          </div>
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


