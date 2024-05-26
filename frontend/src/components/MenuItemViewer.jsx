/*
MenuItemViewer.jsx

This file is called by MenuItemPanel when the user clicks on the image of the menu item.
It uses the menu item ID to fetch the menu item details from the route and display them.
This file is used to display the menu item viewer page of the website. The user can view the details of a menu item and add it to the cart from this page.

Created by Tyler Costa 19075541
*/

// React imports
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
// Header
import UserDashboard from './UserDashboard'; // Import UserDashboard
// Styles
import '../style/MenuItemViewer.css';
// Footer
import Footer from './sharedComponents/Footer';
// Styles
import './buttonTeststyle.css';

const MenuItemViewer = () => {
  // Variables
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();
  const [ingredientCounts, setIngredientCounts] = useState({});
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  //animation variables
  const [hidden, setHidden] = useState(false);
  const [animateCheck, setAnimateCheck] = useState(false);
  const [animateMessage, setAnimateMessage] = useState(false);

  // Fetch the user details from the session
  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          setUniversity(res.data.university);
          setUserID(res.data._id);
        } else {
          // Redirect to the home page if the user is not logged in
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Fetch the menu item data using the ID from the URL
  useEffect(() => {
    fetch(`http://localhost:8082/api/menuItems/${id}`)
      .then(response => response.json())
      .then(data => {
        setMenuItem(data);
        // Initialize ingredient counts from their default value assigned when created by an admin
        const initialCounts = {};
        data.ingredients.forEach(ingredient => {
          initialCounts[ingredient.name] = ingredient.quantity; 
        });
        setIngredientCounts(initialCounts);
      })
      .catch(error => console.error(error));
  }, [id]);

  // Fetch the user's admin status
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

  // Function to increment the ingredient count
  const incrementIngredient = (ingredient) => {
    setIngredientCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      // sets maximum to 5
      if (newCounts[ingredient] < 5) { 
        newCounts[ingredient]++;
      }
      return newCounts;
    });
  };

  // Function to decrement the ingredient count
  const decrementIngredient = (ingredient) => {
    setIngredientCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      // sets minimum to 0
      if (newCounts[ingredient] > 0) { 
        newCounts[ingredient]--;
      }
      return newCounts;
    });
  };

  // Function to handle changes in the additional instructions textarea
  const handleInstructionsChange = (event) => {
    setInstructions(event.target.value);
  };

  // Function to add the menu item to the cart
  const addToCart = async () => {
    try {
      // menuItem is added to cart as an object
      const cartItem = {
        menuItemId: menuItem._id,
        name: menuItem.name,
         // Get total cost of the cart item by multiplying the cost of the menu item by the quantity
        cost: parseFloat(menuItem.cost) * quantity,
        // Ingredients are an array of objects with name and quantity, use default quantity if not changed
        ingredients: menuItem.ingredients.map(ingredient => ({
          name: ingredient.name,
          quantity: ingredientCounts[ingredient.name] || ingredient.quantity 
        })),
        additional_information: instructions,
        menuItemImage: menuItem.menuItemImage

      };

      // Send the cart item to the backend (cart) - which is unique to the user
      const response = await axios.post('http://localhost:8082/api/cart/add', {
        email: email,
        menuItem: cartItem,
        restaurant_id: menuItem.restaurant_id // assuming the restaurant_id is stored in the menuItem object
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
  };

  // Render the menu item viewer content
  return (
    <div>
      <div>
        {/* Header */}
        <UserDashboard /> 

      </div>
      {menuItem ? (
        <div>

          {/* Display the menu item details */}
          <div className='menuContainer'>
            {/**Gives admin the ability to edit the menu item */}
            <h3>{menuItem.name}</h3>
            {/*Only render this button if the user is an admin */}
            {isAdmin && (
            <button onClick={() => navigate(`/MenuItemEditor/${menuItem._id}`)}>
              Edit this item
            </button>
            )}
          </div>
          <hr />
          <div className='menuContainer'>
            <p>Description: {menuItem.item_desc}</p>
            <p>Ingredients:</p>
            <ul>
              {/**List of ingredients and the ability to increment or decrement the amount */}
              {menuItem.ingredients.map((ingredient, index) => (
                <div key={index}>
                  <div className='menu-item'>
                    <span>{ingredient.name}: </span>
                    <span>{ingredientCounts[ingredient.name]}</span>
                    <button className='buttonDown' onClick={() => decrementIngredient(ingredient.name)}>-</button>

                    <button className='buttonUp' onClick={() => incrementIngredient(ingredient.name)}>+</button>
                  </div>
                </div>
              ))}
            </ul>
            <br></br>
            <textarea value={instructions} onChange={handleInstructionsChange} placeholder="Additional instructions..."></textarea>
            <br></br>
            {/**Add to cart button with animations */}
            <button className={`animatedCartBtn ${hidden ? 'hide' : ''}`} id="btn" onClick={addToCart}>
              Add To Cart
            </button>
            <div className="row">
              <span className={`check ${animateCheck ? 'rotateIn' : ''}`} id="check">
                <i className="bi bi-check-lg"></i>
              </span>
              <span className={`message ${animateMessage ? 'fadeIn' : ''}`} id="message">
                Added To cart
              </span>
            </div>

          </div>

        </div>
      ) : null}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MenuItemViewer;