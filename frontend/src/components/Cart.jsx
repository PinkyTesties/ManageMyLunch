import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "./componentAssets/logov1.png";
import beefImage from './beef.jpg';
import emailjs from 'emailjs-com';
import UserDashboard from './UserDashboard';
import Footer from '../components/sharedComponents/Footer';
import '../style/Cart.css'; // Make sure to create and import this CSS file

const Cart = () => {
  const [cart, setCart] = useState({ menuItems: [] });
  const [userID, setUserID] = useState("");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(''); //this is the email message
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [items, setItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  //const totalCost = menuItems.reduce((total, item) => total + parseFloat(item.cost), 0);
  //const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('None'); // New state variable for the applied discount code
  //const [cart, setCart] = useState({ menuItems: [], totalCost: 0 }); // Add totalCost to the initial state

  const [subtractDiscountAmount, setSubtractAmount] = useState(0); // New state variable for the discount amount to subtract from the total cost
  const navigate = useNavigate();

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState(formattedTomorrow);

  const [discountCode, setDiscountCode] = useState('');

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);



  useEffect(() => {
    Promise.all(cart.menuItems.map(item =>
      fetch(`http://localhost:8082/api/menuItems/${item._id}`)
        .then(response => response.json())
    )).then(data => setMenuItems(data));
  }, [cart.menuItems]);

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

  //Email controller
  const sendEmail = () => {
    let cartItemsString = cart.menuItems.map(item => {
      if (item.price) {
        return item.name + " - $" + item.price.toFixed(2);
      } else {
        console.error(`Item ${item.name} does not have a price`);
        return item.name;
      }
    }).join("\n");


    const emailParams = {
      email_from: email,
      message:
        "Thank you " + name + " for your order! \n" +
        "Your order will be delivered to " + university + " on " + deliveryDate + ". \n\n" +
        "Your order details: \n\n" +

        "Your order total is $" + (totalCost + deliveryFee + serviceFee).toFixed(2) + ". Your order will be delivered lunch time of " + deliveryDate + ". \n\n" +
        "Your cart items: \n" + cartItemsString
    };

    emailjs.send('service_gmcskkn', 'template_v78bl21', emailParams, 'XfgsvummwbkF3G1dV')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
        console.log('FAILED...', err);
      });

    console.log('Email:', email);
    console.log('Message:', message);
  };

  const handleBuyNow = (e) => {
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

    axios
      .post("http://localhost:8082/api/completedCarts", completedCart)
      .then((res) => {
        navigate('/OrderStatus', { state: { completedCartId: res.data._id } });
      })
      .catch((err) => console.log(err));

    sendEmail(e);

    deleteCart();
  }

  // return (



  //   <>
  //     <UserDashboard /> {/* Use UserDashboard */}

  //   <div className="cart-container">
  //     <header className="cart-header">
  //       <h1>Your Cart</h1>
  //     </header>
  //     {/*
  //         //<input type="time" onChange={e => setDeliveryTime(e.target.value)} required />
  // */}
  //     <hr />
  //     <div >

  //       <div className="cart-top">
  //         <div></div>

  //         {/* {<div>
  //           <h2>
  //             Date Created: {new Date(cart.date_created).toLocaleDateString()}
  //           </h2>
  //         </div>} */}
  //       </div>
  //       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }} className="cart-middle">
  //         <div>
  //           {cart.menuItems.map((item, index) => (
  //             <div className='cart-items' key={index}>
  //               <div className='remove-cart'>

  //               {//** Use item._id to fetch the correct menuItemImage string*/
  //               }
  //                 <img 
  //                 src={`http://localhost:8082/menuItem_Assets/${item.menuItemImage}`}
  //                 height={200}
  //                 width={300}
  //                 ></img>


  //               </div>
  //               <div className="remove-cart">
  //                 <h4><b>{item.name}</b></h4>
  //                 <button onClick={() => { handleRemoveItem(index); handleRemove(item._id, index); }}>Remove from cart</button>
  //               </div>
  //               <p><b>${parseFloat(item.cost).toFixed(2)}</b></p>

  //               {item.ingredients.map((ingredient, i) => (
  //                 <div key={i}>
  //                   <p>Ingredient Name: {ingredient.name}</p>
  //                   <p>Ingredient Quantity: {ingredient.quantity}</p> {/* Ensure that you're correctly accessing the quantity property */}
  //                   <p>Ingredient index: {index}</p>
  //                 </div>
  //               ))}
  //               <p>Additional Information: {item.additional_information}</p>
  //               <hr />
  //             </div>
  //           ))}
  //         </div>
  //         <div className="cart-bottom" style={{ alignSelf: 'start', border: '1px solid black', padding: '10px', width: '900px', height: '800px', display: 'flex', flexDirection: 'column' }}>
  //           <span>Delivery Date: <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required /></span>
  //           <h2>{restaurantName}</h2>

  //           <br></br>
  //           <p>Cart cost: ${totalCost.toFixed(2)}</p>
  //           <p>Service Fee: ${serviceFee}</p>
  //           <p>Delivery Fee: ${deliveryFee}</p>
  //           <br></br>
  //           <p>Discount code applied: {appliedDiscountCode}</p>{/* Display the discounts applied to the cart, none by default */}
  //           <br></br>


  //           <br></br>
  //           <br></br>
  //           <div>
  //             <input
  //               type="text"
  //               value={discountCode}
  //               onChange={(e) => setDiscountCode(e.target.value)}
  //               placeholder="Enter discount code"
  //             />
  //             <button onClick={handleApplyDiscount}>Apply</button>
  //           </div>
  //           <br></br>
  //           <p> </p>
  //           <br></br>
  //           <div>
  //             <input
  //               type="text"
  //               value={additionalInfo}
  //               onChange={(e) => setAdditionalInfo(e.target.value)}
  //               placeholder="Add additional info here"
  //             />
  //           </div>
  //           <h2>Total Cost: ${(totalCost + deliveryFee + serviceFee).toFixed(2)}</h2>

  //           <div>
  //             <button onClick={handleBuyNow} disabled={cart.menuItems.length === 0}>Buy Now</button>
  //           </div>
  //         </div>
  //       </div>
  //       {/**
  //       <div className="cart-bottom">
  //       <br></br>
  //       <br></br>
  //       <br></br>
  //       <p> </p>
  //       <br></br>
  //       <div>
  //     <div className="cart-details">
  //       <span>Delivery Date: <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required /></span>
  //       <h2>{restaurantName}</h2>
  //       <h2>Total Cost: ${totalCost.toFixed(2)}</h2>
  //     </div>
  //     <hr />
  //     <div className="cart-items-container">
  //       {cart.menuItems.map((item, index) => (
  //         <div className="cart-item" key={index}>
  //           <img src={beefImage} alt="Item" className="cart-item-image" />
  //           <div className="cart-item-details">
  //             <h4>{item.name}</h4>
  //             <p>${parseFloat(item.cost).toFixed(2)}</p>
  //             <button onClick={() => handleRemove(item._id, index)}>Remove</button>
  //             {item.ingredients.map((ingredient, i) => (
  //               <div key={i} className="cart-item-ingredient">
  //                 <p>{ingredient.name} - {ingredient.quantity}</p>
  //               </div>
  //             ))}
  //             <p>{item.additional_information}</p>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //     <div className="cart-actions">
  //       <input
  //         type="text"
  //         value={additionalInfo}
  //         onChange={(e) => setAdditionalInfo(e.target.value)}
  //         placeholder="Add additional info here"
  //         className="additional-info-input"
  //       />
  //       </div>
  //       <div>
  //       <button onClick={handleBuyNow} disabled={cart.menuItems.length === 0}>Buy Now</button>
  //       </div>
  //       </div>
  //        */}
  //       <button onClick={handleBuyNow} disabled={cart.menuItems.length === 0} className="buy-now-button">
  //         Buy Now
  //       </button>
  //     </div>

  //   </div>

  //   </>
  // );

  return (
    <div class="wholePage">
      <div>
        <UserDashboard />
      </div>

      <div className="cart-container">
        <header className="cart-header">
          <h1>Your Cart with '{restaurantName}'</h1>
        </header>
        <div className="cart-details">

          <div className="delivery-and-total-cost">
            <span>Delivery Date: <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required /></span>
            <div className="totalCost">
            <h1>Total Cost: ${(totalCost + deliveryFee + serviceFee).toFixed(2)}</h1>
            </div>
          </div>
         
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

      </div>
    </div>




  );
};

export default Cart;

