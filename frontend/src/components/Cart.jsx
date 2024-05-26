/*
This the Cart.jsx file, it displays the items in the cart and allows the user to remove items from the cart.
The user can also apply a discount code to the cart and buy the items in the cart.

All Cart functionality is handled in this file.

Created by Tyler Costa 19075541

*/

//React imports
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com"; //Connects to emailjs api so that Cart can send confirmation email
import UserDashboard from "./UserDashboard"; // Header import
import Footer from "../components/sharedComponents/Footer"; //Footer import
import "../style/Cart.css"; // Make sure to create and import this CSS file

const Cart = () => {
  const [cart, setCart] = useState({ menuItems: [] });

  // Cart variables for the cart items, pricing and reward system
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState("None");
  const [subtractDiscountAmount, setSubtractAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split("T")[0];
  const [deliveryDate, setDeliveryDate] = useState(formattedTomorrow);

  //Fetch menu items from the cart 
  useEffect(() => {
    Promise.all(
      cart.menuItems.map((item) =>
        fetch(`http://localhost:8082/api/menuItems/${item._id}`).then(
          (response) => response.json()
        )
      )
    ).then((data) => setMenuItems(data));
  }, [cart.menuItems]);

  //Fetch the current system delivery fee set by admin
  useEffect(() => {
    axios
      .get("http://localhost:8082/api/systemAdmin/getDeliveryFee")
      .then((response) => setDeliveryFee(response.data.fee))
      .catch((error) => console.error(error));
  }, []);

  //Fetch the current system service fee set by admin
  useEffect(() => {
    axios
      .get("http://localhost:8082/api/systemAdmin/getServiceFee")
      .then((response) => setServiceFee(response.data.fee))
      .catch((error) => console.error(error));
  }, []);

  //Fetch all active rewards from the database, if the user inputs a valid discount code, apply the discount
  //If invalid it will alert the user
// It searches all rewards for a matching discountCode
  const handleApplyDiscount = () => {
    axios
      .get("http://localhost:8082/api/rewards/active")
      .then((response) => {
        const reward = response.data.find((r) => r.code === discountCode);
        if (reward) {
          if (reward.freeDelivery) {
            // If the reward is classed as freeDelivery, set the delivery fee to 0
            setDeliveryFee(0); // Set delivery fee to 0
            setSubtractAmount(0); // Prevents subtracting the discount amount from the total cost
          }
          if (reward.menuItemDiscount) {
            // If the reward is classed as a menuItemDiscount, subtract the dollarValue from the total cost
            let newTotalCost = totalCost - reward.dollarValue;
            newTotalCost = newTotalCost < 0 ? 0 : newTotalCost;
            setTotalCost(newTotalCost); //Set new total cost
            setSubtractAmount(reward.dollarValue); //set subtract amount
            setDeliveryFee(deliveryFee); //Set delivery fee
          }
          if (reward.deliveryDiscount) {
            //if the discount code is classed as a delivery discount, subtract the dollarValue from the delivery fee
            setDeliveryFee(deliveryFee - reward.dollarValue);
            setSubtractAmount(0); // Do not subtract any amount from the total cost
          }
          setAppliedDiscountCode(reward.code); // Update the applied discount code
        } else {
          console.log("Invalid or inactive discount code");
          alert("Invalid or inactive discount code"); // Notify the user that the discount code is invalid
        }
      })
      .catch((error) => console.error(error));
  };

//Fetches session variables
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

  //Fetches the user cart by using the sessions email address
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

  //Fetches the restaurant name by using the restaurant id in the cart
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

  //Calculates the total cost of the cart
  useEffect(() => {
    let cost = 0;
    cart.menuItems.forEach((item) => {
      cost += parseFloat(item.cost);
    });
    setTotalCost(cost);
  }, [cart.menuItems]);

  // Handles the deletion of a cart
  const deleteCart = () => {
    axios
      .delete(`http://localhost:8082/api/cart/${cart._id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  //Handles the removal of an item from the cart
  function handleRemove(itemId, index) {
    axios
      .put(`http://localhost:8082/api/cart/remove/${email}`, {
        menuItemId: itemId,
        index: index,
      })
      .then((res) => {
        const validMenuItems = res.data.menuItems.filter(
          (item) => item !== null
        );
        setCart({ ...res.data, menuItems: validMenuItems });
      })
      .catch((err) => console.log(err));
  }

  //Email controller
  const sendEmail = () => {
    //Create a list of all itmes in the cart and their prices for email
    let cartItemsString = cart.menuItems
      .map((item) => {
        if (item.price) {
          return item.name + " - $" + item.price.toFixed(2);
        } else {
          console.error(`Item ${item.name} does not have a price`);
          return item.name;
        }
      })
      .join("\n");

      //the actual email message
    const emailParams = {
      email_from: email,
      message:
        "Thank you " +
        name +
        " for your order! \n" +
        "Your order will be delivered to " +
        university +
        " on " +
        deliveryDate +
        ". \n\n" +
        "Your order details: \n\n" +
        "Your order total is $" +
        (totalCost + deliveryFee + serviceFee).toFixed(2) +
        ". Your order will be delivered lunch time of " +
        deliveryDate +
        ". \n\n" +
        "Your cart items: \n" +
        cartItemsString, // Add the list of cart items from above to the email
    };

    //Api keys as per set in emailJS account
    emailjs
      .send(
        "service_gmcskkn",
        "template_v78bl21",
        emailParams,
        "XfgsvummwbkF3G1dV"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (err) => {
          console.log("FAILED...", err);
        }
      );

      //output to console
    console.log("Email:", email);
    console.log("Message:", message);
  };

  //Handles the confimration of the purchase, and submitting to 'completedCart' collection in mongo
  const handleBuyNow = (e) => {

    // Log the cost of each menuItem
    cart.menuItems.forEach((item) => {
      console.log(`Cost of item ${item._id}: ${item.cost}`);
    });

    // Calculate the total cost of the cart items
    const totalCost = cart.menuItems.reduce((total, item) => {
      console.log(
        `Current total: ${total}, cost of current item: ${item.cost}`
      );
      return total + parseFloat(item.cost);
    }, 0);

    // Generate a random 4 digit code for the order
    const code = Math.floor(1000 + Math.random() * 9000);

    // Calculate the final cost of the cart, this includes the total itemcost,
    // subtracted discount amount, service fee and delivery fee
    let finalCost = totalCost - subtractDiscountAmount + serviceFee;
    finalCost = finalCost < 0 ? deliveryFee : finalCost + deliveryFee;

    //Create a completed cart object to be sent to the database
    const completedCart = {
      email: email,
      cost: finalCost,
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
    };

    axios
      .post("http://localhost:8082/api/completedCarts", completedCart) //sends the completed cart to the database
      .then((res) => {
        navigate("/OrderStatus", { state: { completedCartId: res.data._id } });
      })
      .catch((err) => console.log(err));

    sendEmail(e);

    deleteCart();
  };

  //Displays the cart items and allows the user to remove items from the cart. It also displays the breakdown of cost and allows the user to apply a discount code
  // Discount code is applied to the cart and the total cost is updated in real time
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
            <span>
              Delivery Date:{" "}
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </span>
            <div className="totalCost">
              <h1>
                Total Cost: ${(totalCost + deliveryFee + serviceFee).toFixed(2)}
              </h1>
            </div>
          </div>

          <br></br>
          <p>Cart cost: ${totalCost.toFixed(2)}</p>
          <p>Service Fee: ${serviceFee}</p>
          <p>Delivery Fee: ${deliveryFee}</p>
          <br></br>
          <p>Discount code applied: {appliedDiscountCode}</p>
          {/* Display the discounts applied to the cart, none by default */}
          <br></br>

          <div>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter discount code"
            />
            <button className="cartButton" onClick={handleApplyDiscount}>
              Apply
            </button>
          </div>
        </div>
        <hr />
        <div className="cart-items-container">
          {cart.menuItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img
             
                src={`http://localhost:8082/menuItem_Assets/${item.menuItemImage}`}
                alt="Item"
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>${parseFloat(item.cost).toFixed(2)}</p>
                <button
                  className="cartButton"
                  onClick={() => handleRemove(item._id, index)}
                >
                  Remove
                </button>
                {item.ingredients.map((ingredient, i) => (
                  <div key={i} className="cart-item-ingredient">
                    <p>
                      {ingredient.name} - {ingredient.quantity}
                    </p>
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
            <button
              onClick={handleBuyNow}
              disabled={cart.menuItems.length === 0}
              className="buy-now-button"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
