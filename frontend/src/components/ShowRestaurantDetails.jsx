//Show Restaurant Details
/**
ShowRestaurantDetails.jsx

ShowRestaurantDetails component is used to display the details of a restaurant. 
It fetches the restaurant details and menu items from the backend and displays them on the page. 
Provides admin options to create, update, and delete menu items and the restaurant itself.

It displays menuItem panels for each menu item in the restaurant. Editable in menuItemPanel.jsx
Created by Tyler Costa 19075541
*/

//React imports
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
//MenuItemPanel
import MenuItemPanel from './MenuItemPanel';
//Header
import UserDashboard from './UserDashboard';
//Styles
import '../style/ShowRestaurantDetails.css';
//Footer
import Footer from './sharedComponents/Footer';

function ShowRestaurantDetails(props) {
  //Variables
  const [restaurant, setRestaurant] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("")

  const { id } = useParams();
  const navigate = useNavigate();

  //Fetch the restaurant details
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

  //Function to handle deleting the restaurant
  const onDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      axios
        .delete(`http://localhost:8082/api/restaurants/${id}`)
        .then((res) => {
          navigate('/dashboard');
        })
        .catch((err) => {
          console.log('Error form ShowRestaurantDetails_deleteClick');
        });
    }
  };

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

  //Fetch the menu items
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

  //Display "no menu items" if there are no menu items, otherwise display the menu items
  const MenuItemsList =
    menuItems.length === 0
      ? 'there are no menu items'
      : menuItems.map((menuItem, k) => <MenuItemPanel menuItem={menuItem} key={k} />);

//Render the restaurant details and menu items
  return (
    <div >
      {/*Header*/ }
      <UserDashboard /> {/* Use UserDashboard */}
      <div className='wholePageContainer'>
        <div >
          <div className='titleContainer'>
            {/* Display the restaurant image, name, and description */}
            <h1 className='restaurant-name'>{restaurant.restaurantName}</h1>
          </div>
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
              {/* Display the restaurant rating, description and link to view reviews */}
              <h5>Google Rating: </h5>
              <span className="rating-value">{restaurant.rating} Stars </span>
              <br />
              <br />
              <b>{restaurant.description}</b>
            </div>
            <Link to={`/ViewRestaurantReviews/${restaurant._id}`} className="review-link">View Restaurant reviews</Link>
          </div>
        </div>
        <div className='row'>
          {/* Display the menu items */}
            {MenuItemsList}

            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

        <div className='restaurant-details-container'>
 
        {/*Control buttons for admin users*/}
        {isAdmin && (
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
                 )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ShowRestaurantDetails;