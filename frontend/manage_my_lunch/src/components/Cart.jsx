import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "./componentAssets/logov1.png";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const navigate = useNavigate();

  const [cart, setCart] = useState({ menuItems: [] }); // New state variable for the cart
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
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const [userID, setUserID] = useState("");
  // New useEffect hook to fetch the cart data when the email changes
  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:8082/api/cart/${email}`)
        .then((res) => {
          // Check if the email from the response matches the email state
          if (res.data.email === email) {
            // If it does, then set the cart state with the response data
            setCart(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [email]);

  // New useEffect hook to fetch the restaurant name when the cart or email changes
  useEffect(() => {
    if (cart.restaurant_id) {
      axios
        .get(`http://localhost:8082/api/restaurants/${cart.restaurant_id}`)
        .then((res) => {
          // Set the restaurant name state with the name from the response
          console.log(res.data);
          setRestaurantName(res.data.restaurantName);
        })
        .catch((err) => console.log(err));
    }
  }, [cart, email]);

  const deleteCart = () => {
    axios
      .delete(`http://localhost:8082/api/cart/${cart._id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  // Add a function to handle the "Buy Now" button click
  function handleBuyNow() {
    const completedCart = {
      email: email,
      cost: cart.cost,
      date_created: cart.date_created,
      menuItems: cart.menuItems,
      restaurant_id: cart.restaurant_id,
      restaurant_name: restaurantName,
      additionalInfo: additionalInfo,
    };

    axios
      .post("http://localhost:8082/api/completedCarts", completedCart)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    alert("Order placed successfully");

    deleteCart();
  }
  return (
    <div>
      <img src={logo} alt="Logo" height={100} />
      <h1>Your Cart</h1>
      <p>***** CSS NOT DONE. DO NOT SUBMIT *****</p>

      <button className="header-button-right">
        <Link to={"/"} style={{ textDecoration: "none", color: "Black" }}>
          Logout
        </Link>
      </button>
      <p>Logged in as: {email}</p>
      <div>
        <h2>Cost: {cart.cost}</h2>
        <h2>
          Date Created: {new Date(cart.date_created).toLocaleDateString()}
        </h2>
        <h2>Restaurant ID: {cart.restaurant_id}</h2>
        <h2>Restaurant Name: {restaurantName}</h2>
        <p>-----------------------------------</p>
        {cart.menuItems.map((item, index) => (
          <div key={index}>
            <p><b>Item ID: {item.menuItemId}</b></p>

            {item.ingredients.map((ingredient, i) => (
              <div key={i}>
                <p>Ingredient Name: {ingredient.name}</p>
                <p>Ingredient Quantity: {ingredient.quantity}</p>
              </div>
            ))}
            <p>Additional Information: {item.additional_information}</p>
            <p>***</p>

          </div>
        ))}
      </div>
      <p>-----------------------------------</p>

      <p>Add additional information here:</p>
      <input
        type="text"
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
        placeholder=""
      />
      <br></br>
      <br></br>
      <br></br>
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default Cart;

/*
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantPanel from './RestaurantPanel';
import logo from './componentAssets/logov1.png';
Modal.setAppElement('#root');

const Dashboard = ({history}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [userID, setUserID] = useState('');
  const [cart, setCart] = useState({ menuItems: [] }); // New state variable for the cart

  const navigate = useNavigate();

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

  // New useEffect hook to fetch the cart data when the email changes
  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8082/api/cart/${email}`)
      .then((res) => {
        setCart(res.data);
      })
      .catch(err => console.log(err))
    }
  }, [email])

  return (
    <div>
      <img src={logo} alt='Logo' height={100} />
      <h1>Your Cart</h1>
      <p>***** CSS NOT DONE. DO NOT SUBMIT *****</p>

      <button className='header-button-right'><Link to={'/'} style={{ textDecoration: 'none', color: 'Black' }}>Logout</Link></button>
      <p>Logged in as: {name}, {university}, {email}, {userID}</p>

      {cart.menuItems.map((item, index) => (
        <div key={index}>
          <p>{item.name}: {item.quantity}</p>
        </div>
      ))}
    </div> 
  );
};

export default Dashboard;
*/
