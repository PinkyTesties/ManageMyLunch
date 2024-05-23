import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantPanel from './RestaurantPanel';
import logo from './componentAssets/logov1.png';
import UserDashboard from './UserDashboard';
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
  const [userRewardPoints, setUserRewardPoints] = useState(0);

  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

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
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.log('Error from Dashboard'));
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

  return (

    <div className='dashboard'>
      
    {/* Header */}
    <UserDashboard />
    {/* Restaurant List */}
    <div className='restaurant-list'>
      {/* Filter by Cuisine */}
      <div className='filter-container'>
        {['All', 'BBQ', 'Healthy', 'Korean', 'Chinese', 'Japanese', 'American', 'Indian', 'Italian'].map((cuisine) => (
          <button
            key={cuisine}
            className={`filter-button ${selectedCuisine === cuisine ? 'active' : ''}`}
            onClick={() => handleCuisineChange({ target: { value: cuisine === 'All' ? '' : cuisine } })}          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Restaurant Cards */}
      
      <div className='restaurant-cards'>
        
        <div className='rewards'><h2>Rewards</h2>

            {eligibleRewards.map((reward, index) => (
              <div key={index}>
                <div className='reward-box'>
                  <br></br>
                  <h4><b>{reward.title}</b></h4>
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
          <div className='restaurant-row'>
            {RestaurantList}
          </div>
        )}

      </div>
    </div>
    {/* <footer style={{
      textAlign: 'center',
      padding: '3px',
      backgroundColor: 'DarkSalmon',
      color: 'white'
    }}>
      <p>Author: Hege Refsnes</p>
      <p><a href="mailto:hege@example.com">hege@example.com</a></p>
    </footer> */}

    <Footer />
  </div>

  );
};

export default Dashboard;
