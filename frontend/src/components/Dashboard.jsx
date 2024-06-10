/* 
Dashbaord.jsx

This page is the main page for the user. It displays all the restaurants and their information.
This page also displays the rewards that the user can redeem. The user can also filter the restaurants by cuisine type.
The restaurants are displayed in a card format, They are from RestaurantPanel.jsx route.

Formatted using Prettier code formatter
Created by: Tyler Costa 19075541, Vidhusan, Ranier
*/

//React imports
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// Import RestaurantPanel which is used to display the restaurant information
import RestaurantPanel from "./RestaurantPanel";
// Import Header
import UserDashboard from "./UserDashboard";
//Styles
import "../style/Dashboard.css";
//Import Footer
import Footer from "../components/sharedComponents/Footer";

const Dashboard = () => {
  //Variables
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [userID, setUserID] = useState("");
  const [userRewardPoints, setUserRewardPoints] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
 
  const navigate = useNavigate();

  //Fetching and setting of session variables
  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          console.log("Email:", res.data.email);
          setUniversity(res.data.university);
        } else {
          //If not logged in. Send back to homepage
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //Array of active rewards recieved from the backend
  const [activeRewards, setActiveRewards] = useState([]);

  //Fetching active rewards
  useEffect(() => {
    fetch("http://localhost:8082/api/rewards/active")
      .then((response) => response.json())
      .then((data) => {
        const rewardsData = data.map((reward) => ({
          id: reward._id,
          code: reward.code,
          points: reward.points,
          message: reward.message,
          title: reward.title,
        }));
        setActiveRewards(rewardsData);
        // display active rewards to console
        console.log("Active rewards:", rewardsData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  //Fetching user ID using the logged in email
  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:8082/api/users/email/${email}`)
        .then((response) => {
          setUserID(response.data._id);
          console.log("User ID:", response.data._id);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [email]);

  //Fetching user admin status using the logged in email
  useEffect(() => {
    if (email) {
      const fetchUserAdminStatus = async () => {
        const response = await fetch(`http://localhost:8082/api/users/email/${email}`);
        const data = await response.json();

        console.log(data);

        setIsAdmin(data.isAdmin);
      };

      fetchUserAdminStatus();
    }
  }, [email]);

  //Fetching user reward points using the user ID
  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/users/${userID}`)
      .then((response) => {
        setUserRewardPoints(response.data.rewardsPoints);
        console.log("User reward points:", response.data.rewardsPoints);
      })
      .catch((error) => console.error("Error:", error));
  }, [userID]);

  //Fetching restaurants from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8082/api/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.log("Error from Dashboard"));
  }, []);

  //Array of eligible rewards that the user is able to redeem
  const [eligibleRewards, setEligibleRewards] = useState([]);

  //Filtering rewards based on user reward points
  useEffect(() => {
    const filteredRewards = activeRewards.filter(
      (reward) => reward.points <= userRewardPoints
    );
    console.log("Eligible rewards:", filteredRewards);
    setEligibleRewards(filteredRewards);
  }, [activeRewards, userRewardPoints]);

  //Function to handle the change of cuisine type
  const handleCuisineChange = (event) => {
    setSelectedCuisine(event.target.value);
  };

  //Filtering restaurants based on the selected cuisine
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      selectedCuisine === "" || restaurant.cuisine === selectedCuisine
  );

  //Mapping the filtered restaurants to the RestaurantPanel component
  const RestaurantList = filteredRestaurants.map((restaurant, k) => (
    <RestaurantPanel restaurant={restaurant} key={k} />
  ));

  return (
<<<<<<< HEAD
    <div>
<<<<<<< HEAD:frontend/manage_my_lunch/src/components/Dashboard.jsx
      <div>
        <header>
=======
      {

      }
      <div className='header'>
        <header className='header'>
>>>>>>> b944fe787571675b27498ea2457756757baa57af:frontend/src/components/Dashboard.jsx
          <img src={logo} alt='Logo' height={100} />
          <h1>Manage My Lunch Dashboard</h1>
          <p></p>
        </header>
        <hr />
        <p>Logged in as: {name}, {university}</p>
        <div className='MenuButtons'>
          <button onClick={toggleDropdown}>Account</button>
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
      <div className='ShowBookList'>
=======
    <div className="dashboard">
      {/* Header */}
      <UserDashboard />
      {/* Restaurant List */}
      <div className="restaurant-list">
        {/* Filter by Cuisine */}
        <div className="filter-container">
          {[
            "All",
            "BBQ",
            "Healthy",
            "Korean",
            "Chinese",
            "Japanese",
            "American",
            "Indian",
            "Italian",
          ].map((cuisine) => (
            <button
              key={cuisine}
              className={`filter-button ${selectedCuisine === cuisine ? "active" : ""
                }`}
              onClick={() =>
                handleCuisineChange({
                  target: { value: cuisine === "All" ? "" : cuisine },
                })
              }
            >
              {cuisine}
            </button>
          ))}
        </div>
        {/*Render button if user is Admin */}
        {isAdmin && (
          <button
            className="add-restaurant-button"
            onClick={() => navigate("/create-restaurant")}
          >
            Add a Restaurant
          </button>
        )}
        <div className="restaurant-cards">
        <section className="rewards">
  <header>
    <h2>Rewards</h2>
  </header>

  {eligibleRewards.map((reward, index) => (
>>>>>>> origin/main

    <article key={index} className="reward-box">
          <br></br>
      <h4>
        <strong>{reward.title}</strong>
      </h4>
      <p>{reward.message}</p>
      <p className="reward-code">
        <strong>
          Use code <em>{reward.code}</em> at checkout
        </strong>
      </p>
    </article>
  ))}
</section>
          {/* Restaurant Cards from RestaurantPanel.jsx are displayed here*/}

<<<<<<< HEAD
            </div>

            <div className='col-md-11'>
              <div className='restaurantFilter'>
                <h5>Filter by cuisine: </h5>
                <select value={selectedCuisine} onChange={handleCuisineChange}>
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
=======
>>>>>>> origin/main
          {RestaurantList.length === 0 ? (
            <div className="alert alert-warning" role="alert">
              No restaurants found.
            </div>
          ) : (
            <div className="restaurant-row">{RestaurantList}</div>
          )}
        </div>
      </div>
      {/* Footer */}

      <Footer />
    </div>
  );
};

export default Dashboard;
