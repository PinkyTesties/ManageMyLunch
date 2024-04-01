import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantPanel from './RestaurantPanel';
import logo from './componentAssets/logov1.png';
Modal.setAppElement('#root');

const Dashboard = ({history}) => {
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
      
      
      if(res.data.valid) {
        setName(res.data.name);
        setEmail(res.data.email);
        setUniversity(res.data.university);
        setUserID(res.data._id);


      } else {
        navigate('/');
      }
    })
    .catch(err => console.log(err))
  }, [])


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
    <div className='header'>
      <div className='MainTitle'>
        <img src={logo} alt='Logo' height={100} />
        <h1>Manage My Lunch Dashboard</h1>
      </div>

      <div className='MenuButtons'>
        <button onClick={toggleDropdown}>Account</button>
        <button className='header-button-right'><Link to="/Cart" style={{ textDecoration: 'none', color: 'Black' }}>Cart</Link></button>
        <button className='header-button-right'><Link to={'/'} style={{ textDecoration: 'none', color: 'Black' }}>Logout</Link></button>
      </div>
      
      <p>Logged in as: {name}, {university}, {email}, {userID}</p>
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

      </div>
      <div className='restaurant-cards-container'>
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


    </div>

  </div>
);
};




export default Dashboard;


