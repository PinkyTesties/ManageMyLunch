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
  const [items, setItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const totalCost = menuItems.reduce((total, item) => total + parseFloat(item.cost), 0);
  const [deliveryTime, setDeliveryTime] = useState(null);

  const navigate = useNavigate();

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format the date as a string in the format YYYY-MM-DD
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];

  // Initialize the deliveryDate state variable to tomorrow's date
  const [deliveryDate, setDeliveryDate] = useState(formattedTomorrow);


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

  useEffect(() => {
    Promise.all(cart.menuItems.map(item =>
      axios.get(`http://localhost:8082/api/menuItems/${item._id}`)
    ))
      .then(response => {
        setMenuItems(response.map(res => res.data));
      })
      .catch(err => console.log(err));
  }, [cart.menuItems]);

  const deleteCart = () => {
    axios
      .delete(`http://localhost:8082/api/cart/${cart._id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  // Add a function to handle the "Buy Now" button click

  // Function to handle removing items from the cart
  function handleRemoveItem(index) {
    const newMenuItems = [...cart.menuItems]; // Create a copy of the cart.menuItems array
    newMenuItems.splice(index, 1); // Remove the item at the specified index
    setCart({ ...cart, menuItems: newMenuItems }); // Update the state
  }

  function handleRemove(itemId, index) {
    axios
      .put(`http://localhost:8082/api/cart/remove/${email}`, { menuItemId: itemId, index: index })
      .then((res) => {
        console.log(res.data);
        // Filter out null values from the menuItems array
        const validMenuItems = res.data.menuItems.filter(item => item !== null);
        // Update the cart state
        setCart({ ...res.data, menuItems: validMenuItems });
      })
      .catch((err) => console.log(err));
  }

  function handleBuyNow() {
    // Log the cost of each menuItem
    cart.menuItems.forEach(item => {
      console.log(`Cost of item ${item._id}: ${item.cost}`);


    });

    const totalCost = cart.menuItems.reduce((total, item) => {
      console.log(`Current total: ${total}, cost of current item: ${item.cost}`);
      return total + parseFloat(item.cost);
    }, 0);

    const completedCart = {
      email: email,
      cost: totalCost,
      date_created: cart.date_created,
      menuItems: cart.menuItems,
      restaurant_id: cart.restaurant_id,
      restaurant_name: restaurantName,
      additionalInfo: additionalInfo,
      delivery_date: new Date(deliveryDate),
      //delivery_time: new Date(`${deliveryDate}T${deliveryTime}`), // Combine date and time
    };

    console.log(completedCart); // Log the completedCart object

    axios
      .post("http://localhost:8082/api/completedCarts", completedCart)
      .then((res) => {
        console.log(res.data);
        navigate('/OrderStatus', { state: { completedCartId: res.data._id } }); // Redirect to the Order Confirmation page
      })
      .catch((err) => console.log(err));

    deleteCart();
  }

  return (
    <div>
      <header className="header">
        <img src={logo} alt="Logo" height={100} />
        <h1>Your Cart</h1>
        <p>***** CSS NOT DONE. DO NOT SUBMIT *****</p>
      </header>
      {/*
          //<input type="time" onChange={e => setDeliveryTime(e.target.value)} required />
  */}

      <button className="header-button-right">
        <Link to={"/"} style={{ textDecoration: "none", color: "Black" }}>
          Logout
        </Link>
      </button>
      <p>Logged in as: {email}</p>
      <div>
        <h3>Total Cost: ${totalCost.toFixed(2)}</h3>
        <h2>
          Date Created: {new Date(cart.date_created).toLocaleDateString()}
        </h2>
        <h2>Restaurant ID: {cart.restaurant_id}</h2>
        <h2>Restaurant Name: {restaurantName}</h2>
        <p>-----------------------------------</p>

      </div>
      Delivery Date: <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required />

      <p>-----------------------------------</p>
      {menuItems.map((item, index) => (
        <div key={index}>
          <p><b>Item Name: {item.name}</b></p>
          <p>Item Cost: ${parseFloat(item.cost).toFixed(2)}</p>
          {item.ingredients.map((ingredient, i) => (
            <div key={i}>
              <p>Ingredient Name: {ingredient.name}</p>
              <p>Ingredient Quantity: {ingredient.quantity}</p>
              <p>Ingredient index: {index}</p>

            </div>
          ))}
          <p>Additional Information: {item.additional_information}</p>
          <button onClick={() => { handleRemoveItem(index); handleRemove(item._id, index); }}>Remove from cart</button> {/* Add this line */}
          <p>***</p>
        </div>
      ))}
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
      <button onClick={handleBuyNow} disabled={cart.menuItems.length === 0}>Buy Now</button>
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
