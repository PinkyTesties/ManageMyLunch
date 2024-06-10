import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "./componentAssets/logov1.png";
import { useNavigate } from "react-router-dom";
import beefImage from './beef.jpg';

const Cart = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [items, setItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  //const totalCost = menuItems.reduce((total, item) => total + parseFloat(item.cost), 0);
  //const [deliveryDate, setDeliveryDate] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('None'); // New state variable for the applied discount code
  const [cart, setCart] = useState({ menuItems: [], totalCost: 0 }); // Add totalCost to the initial state

  const [subtractDiscountAmount, setSubtractAmount] = useState(0); // New state variable for the discount amount to subtract from the total cost
  const navigate = useNavigate();

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format the date as a string in the format YYYY-MM-DD
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];

  // Initialize the deliveryDate state variable to tomorrow's date
  const [deliveryDate, setDeliveryDate] = useState(formattedTomorrow);

  const [discountCode, setDiscountCode] = useState('');

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8082/api/systemAdmin/getDeliveryFee')
      .then(response => setDeliveryFee(response.data.fee))
      .catch(error => console.error(error));
  }, []);
  useEffect(() => {
    axios.get('http://localhost:8082/api/systemAdmin/getServiceFee')
      .then(response => setServiceFee(response.data.fee))
      .catch(error => console.error(error));
  }, []);
  // const handleApplyDiscount = () => {
  //   //This is where we handle the discount code redemption

  //   //Get the discount code from the state
  //   //Check if the discount code is active
  //   //Check if the freeDelivery property is true or false
  //   //Check if the menuItemDiscount property is true or false
  //   //Check if the deliveryDiscount property is true or false
  //   //If the freeDelivery property is true, set the cost of delivery to 0
  //   //If the menuItemDiscount property is true, apply the discount to the menu items

  //   console.log(discountCode);
  // };
  const handleApplyDiscount = () => {
    axios.get('http://localhost:8082/api/rewards/active')
      .then(response => {
        const reward = response.data.find(r => r.code === discountCode);
        if (reward) {
          if (reward.freeDelivery) {
            setDeliveryFee(0);
            setSubtractAmount(0) // Do not subtract any amount from the total cost
          }
          if (reward.menuItemDiscount) {
            let newTotalCost = totalCost - reward.dollarValue;
            newTotalCost = newTotalCost < 0 ? 0 : newTotalCost;
            setTotalCost(newTotalCost);            
            setSubtractAmount(reward.dollarValue);
            setDeliveryFee(deliveryFee);
             // Subtract the discount amount from the total cost as it is a generic cart menu item discount
          }
          if (reward.deliveryDiscount) {
            // Assuming that the discount is a fixed amount specified in dollarValue
            setDeliveryFee(deliveryFee - reward.dollarValue);
            setSubtractAmount(0); // Do not subtract any amount from the total cost
          }
          setAppliedDiscountCode(reward.code); // Update the applied discount code
        } else {
          console.log('Invalid or inactive discount code');
          alert("Invalid or inactive discount code");
        }
      })
      .catch(error => console.error(error));
  };

  //const [cart, setCart] = useState({ menuItems: [] }); // New state variable for the cart
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
    let cost = 0;
    cart.menuItems.forEach(item => {
      cost += parseFloat(item.cost);
    });
    setTotalCost(cost);
  }, [cart.menuItems]);
  // useEffect(() => {
  //   Promise.all(cart.menuItems.map(item =>
  //     axios.get(`http://localhost:8082/api/menuItems/${item._id}`)
  //   ))
  //     .then(response => {
  //       setMenuItems(response.map(res => res.data));
  //     })
  //     .catch(err => console.log(err));
  // }, [cart.menuItems]);

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
  
    const code = Math.floor(1000 + Math.random() * 9000);
  
    let finalCost = totalCost - subtractDiscountAmount + serviceFee;
    finalCost = finalCost < 0 ? deliveryFee : finalCost + deliveryFee;
  
    const completedCart = {
      email: email,
      cost: (finalCost),
      code: code,
      date_created: cart.date_created,
      delivery_fee: deliveryFee,
      service_fee: serviceFee,
      menuItems: cart.menuItems,
      restaurant_id: cart.restaurant_id,
      restaurant_name: restaurantName,
      additionalInfo: additionalInfo,
      delivery_date: new Date(deliveryDate),
      customerName: name,
      delivery_location: university,
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
    <div >
      <header>
        <img src={logo} alt="Logo" />
        <h1>Your Cart</h1>
        <p></p>
      </header>
      {/*
          //<input type="time" onChange={e => setDeliveryTime(e.target.value)} required />
  */}
      <hr />
      <div >

        <div className="cart-top">
          <div></div>

          {/* {<div>
            <h2>
              Date Created: {new Date(cart.date_created).toLocaleDateString()}
            </h2>
          </div>} */}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }} className="cart-middle">
          <div>
            {cart.menuItems.map((item, index) => (
              <div className='cart-items' key={index}>
                <div className='remove-cart'>
                  <img src={beefImage} />
                </div>
                <div className="remove-cart">
                  <h4><b>{item.name}</b></h4>
                  <button onClick={() => { handleRemoveItem(index); handleRemove(item._id, index); }}>Remove from cart</button>
                </div>
                <p><b>${parseFloat(item.cost).toFixed(2)}</b></p>
                {item.ingredients.map((ingredient, i) => (
                  <div key={i}>
                    <p>Ingredient Name: {ingredient.name}</p>
                    <p>Ingredient Quantity: {ingredient.quantity}</p> {/* Ensure that you're correctly accessing the quantity property */}
                    <p>Ingredient index: {index}</p>
                  </div>
                ))}
                <p>Additional Information: {item.additional_information}</p>
                <hr />
              </div>
            ))}
          </div>
          <div className="cart-bottom" style={{ alignSelf: 'start', border: '1px solid black', padding: '10px', width: '900px', height: '800px', display: 'flex', flexDirection: 'column' }}>
            <span>Delivery Date: <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required /></span>
            <h2>{restaurantName}</h2>

            <br></br>
            <p>Cart cost: ${totalCost.toFixed(2)}</p>
            <p>Service Fee: ${serviceFee}</p>
            <p>Delivery Fee: ${deliveryFee}</p>
            <br></br>
            <p>Discount code applied: {appliedDiscountCode}</p>{/* Display the discounts applied to the cart, none by default */}
            <br></br>


            <br></br>
            <br></br>
            <div>
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter discount code"
              />
              <button onClick={handleApplyDiscount}>Apply</button>
            </div>
            <br></br>
            <p> </p>
            <br></br>
            <div>
              <input
                type="text"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Add additional info here"
              />
            </div>
            <h2>Total Cost: ${(totalCost + deliveryFee + serviceFee).toFixed(2)}</h2>

            <div>
              <button onClick={handleBuyNow} disabled={cart.menuItems.length === 0}>Buy Now</button>
            </div>
          </div>
        </div>
        {/**
        <div className="cart-bottom">
        <br></br>
        <br></br>
        <br></br>
        <p> </p>
        <br></br>
        <div>
        <input
          type="text"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Add additional info here"
        />
        </div>
        <div>
        <button onClick={handleBuyNow} disabled={cart.menuItems.length === 0}>Buy Now</button>
        </div>
        </div>
         */}
      </div>
    </div>
  );
};

export default Cart;
