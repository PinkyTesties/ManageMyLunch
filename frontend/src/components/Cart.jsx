import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "./componentAssets/logov1.png";
import beefImage from './beef.jpg';
import Footer from '../components/sharedComponents/Footer';
import '../style/Cart.css'; // Make sure to create and import this CSS file

const Cart = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [items, setItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState(formattedTomorrow);

  const [cart, setCart] = useState({ menuItems: [] });
  const [userID, setUserID] = useState("");

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

  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:8082/api/cart/${email}`)
        .then((res) => {
          if (res.data.email === email) {
            setCart(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [email]);

  useEffect(() => {
    if (cart.restaurant_id) {
      axios
        .get(`http://localhost:8082/api/restaurants/${cart.restaurant_id}`)
        .then((res) => {
          setRestaurantName(res.data.restaurantName);
        })
        .catch((err) => console.log(err));
    }
  }, [cart, email]);

  useEffect(() => {
    let cost = 0;
    cart.menuItems.forEach(item => {
      cost += parseFloat(item.cost);
    });
    setTotalCost(cost);
  }, [cart.menuItems]);

  const deleteCart = () => {
    axios
      .delete(`http://localhost:8082/api/cart/${cart._id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  function handleRemove(itemId, index) {
    axios
      .put(`http://localhost:8082/api/cart/remove/${email}`, { menuItemId: itemId, index: index })
      .then((res) => {
        const validMenuItems = res.data.menuItems.filter(item => item !== null);
        setCart({ ...res.data, menuItems: validMenuItems });
      })
      .catch((err) => console.log(err));
  }

  function handleBuyNow() {
    const totalCost = cart.menuItems.reduce((total, item) => total + parseFloat(item.cost), 0);
    const code = Math.floor(1000 + Math.random() * 9000);
    const completedCart = {
      email: email,
      cost: totalCost,
      code: code,
      date_created: cart.date_created,
      menuItems: cart.menuItems,
      restaurant_id: cart.restaurant_id,
      restaurant_name: restaurantName,
      additionalInfo: additionalInfo,
      delivery_date: new Date(deliveryDate),
    };

    axios
      .post("http://localhost:8082/api/completedCarts", completedCart)
      .then((res) => {
        navigate('/OrderStatus', { state: { completedCartId: res.data._id } });
      })
      .catch((err) => console.log(err));

    deleteCart();
  }

  return (
    <>
    <div className="cart-container">
      <header className="cart-header">
        <h1>Your Cart</h1>
        <img src={logo} alt="Logo" className="cart-logo" />
      </header>
      <div className="cart-details">
        <span>Delivery Date: <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required /></span>
        <h2>{restaurantName}</h2>
        <h2>Total Cost: ${totalCost.toFixed(2)}</h2>
      </div>
      <hr />
      <div className="cart-items-container">
        {cart.menuItems.map((item, index) => (
          <div className="cart-item" key={index}>
            <img src={beefImage} alt="Item" className="cart-item-image" />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p>${parseFloat(item.cost).toFixed(2)}</p>
              <button onClick={() => handleRemove(item._id, index)}>Remove</button>
              {item.ingredients.map((ingredient, i) => (
                <div key={i} className="cart-item-ingredient">
                  <p>{ingredient.name} - {ingredient.quantity}</p>
                </div>
              ))}
              <p>{item.additional_information}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-actions">
        <input
          type="text"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Add additional info here"
          className="additional-info-input"
        />
        <button onClick={handleBuyNow} disabled={cart.menuItems.length === 0} className="buy-now-button">
          Buy Now
        </button>
      </div>

    </div>
          <Footer />
    </>
  );
};

export default Cart;

