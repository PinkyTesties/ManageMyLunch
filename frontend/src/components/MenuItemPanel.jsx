/*
MenuItemPanel.jsx

This file is used to display the menu items in the menu. The user can view the menu items and add them to the cart from this page.
This file has an add to cart animation that shows a checkmark and a message when the user adds an item to the cart.
The user can view the full item details by clicking on the image.

Created by Tyler Costa 19075541

*/

//React imports
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
//Styles
import '../App.css';
import '../style/addToCartButtonStyle.css';
import '../style/MenuItemPanel.css';

const MenuItemPanel = ({ menuItem }) => {
  //Variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [userID, setUserID] = useState('');
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  const [hidden, setHidden] = useState(false);
  const [animateCheck, setAnimateCheck] = useState(false);
  const [animateMessage, setAnimateMessage] = useState(false);

  //Fetch the user details from the session
  useEffect(() => {
    axios.get('http://localhost:8082')
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          setUniversity(res.data.university);
          setUserID(res.data._id);
        } else {
          //redirect to the home page if the user is not logged in
          navigate('/');
        }
      })
      .catch(err => console.log(err))
  }, [navigate]);

  //Function to add the menu item object to the cart
  const addToCart = async () => {
    try {
      const cartItem = {
        menuItemId: menuItem._id,
        name: menuItem.name,
        cost: parseFloat(menuItem.cost) * quantity,
        // Ingredients are an array of strings
        ingredients: [],
        additional_information: "",
        menuItemImage: menuItem.menuItemImage
      };

      // Send the cart item to the backend (cart) - which is unique to the user
      const response = await axios.post('http://localhost:8082/api/cart/add', {
        email: email,
        menuItem: cartItem,
        restaurant_id: menuItem.restaurant_id
      });

      // Show the checkmark and message when the item is added to the cart
      setHidden(true);
      setAnimateCheck(true);
      setAnimateMessage(true);

      // Hide the checkmark and message after 4 seconds so the user can add more items
      setTimeout(() => {
        setHidden(false);
        setAnimateCheck(false);
        setAnimateMessage(false);
      }, 4000);

      console.log(response.data);

    } catch (error) {
      console.error(error);
    }
  }

  //Function to delete the menu item - this replaced the deleteMenuItem page
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:8082/api/menuItems/${id}`);
        console.log(response.data.msg); // Log the server's response message
        // Redirect to the dashboard after deleting the item
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
      }
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

  //Render the menu item panel that is then called by ShowRestaurntDetails.jsx
  return (
    <div className='menucard-container'>
      <div className='item'>
        <Link to={`/MenuItemViewer/${menuItem._id}`}>
          {/**Each item in mongo has a 'menuItemImage' attribute which is a string containing the imagename
           * We can then fetch the image from backend/menuItemAssets folder using the imagename
           * 
           * The image is also a link the user can click to view the full item details
           */}
          <img
            src={`http://localhost:8082/menuItem_assets/${menuItem.menuItemImage}`}
            alt='Menu Item'
            height={200}
          />
        </Link>
        <br></br>
        <br></br>

      {/*Menu item details */}
        <span><p>{menuItem.name}</p></span>
        <hr></hr>
      </div>

      <p>${menuItem.cost.toFixed(2)}</p>
      <br></br>
      <p>{menuItem.item_desc}</p>
        
      <button className={`animatedCartBtn ${hidden ? 'hide' : ''}`} id="btn" onClick={addToCart}>
        Add To Cart
      </button>

      {/*Allow the admin to delete the menu item but not a user */}
      {isAdmin && (
      <button className='deleteButton' onClick={() => handleDelete(menuItem._id)}> Delete Item</button>
    )}
      {/**Add to cart animation */}
      <div className="row">
        <span className={`check ${animateCheck ? 'rotateIn' : ''}`} id="check">
          <i className="bi bi-check-lg"></i>
        </span>
        <span className={`message ${animateMessage ? 'fadeIn' : ''}`} id="message">
          Added To Cart
        </span>
      </div>
    </div>
  );
};

export default MenuItemPanel;
