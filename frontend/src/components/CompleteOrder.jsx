/* 
CompleteOrder.jsx
This page handles the completion of an order delivery from the customers side. Once their order is delivered,
They can either scan their qr code or manually type in their unique code.


Created by Tyler Costa 19075541
*/

import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com"; //EmailJS api for emailing
import UserDashboard from "./UserDashboard"; // Import Header
import "../style/CompleteOrder.css"; //Styles
import Footer from "../components/sharedComponents/Footer"; //Import Footer

const CompleteOrder = () => {
  //Variables
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  //Handles input change
  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value.length > 4) {
      setError("Input should be a four-digit number");
    } else if (!/^\d+$/.test(value)) {
      setError("Input should only contain digits");
    } else {
      setError("");
    }
    setCode(value);
  };

  //Sets error
  const handleError = (err) => {
    setError(err);
  };

  //Marks the order as compelete
  const markComplete = async () => {
    try {
      //Fetch cart by its order.id
      const response = await fetch(
        `http://localhost:8082/api/completedCarts/complete/${cart._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          //Mark status as Completed
          body: JSON.stringify({ orderStatus: "Completed" }),
        }
      );
      const updatedCart = await response.json();
      setCart(updatedCart);

      // Add points to user profile
      const amountPoints = parseFloat(cart.cost.toFixed(2));
      console.log("The points to add are: ", amountPoints);

      // Fetch the user by email
      const userResponse = await fetch(
        `http://localhost:8082/api/users/email/${cart.email}`
      );
      const user = await userResponse.json();

      // Calculate the new reward points
      const newRewardPoints = (user.rewardsPoints || 0) + amountPoints;

      // Update the user's reward points
      await fetch(`http://localhost:8082/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rewardsPoints: newRewardPoints }),
      });

      sendEmail();
      alert("Order marked as complete");

      // Navigate to the OrderStatus page
      navigate("/OrderStatus");
    } catch (err) {
      setError(err.message);
    }
  };

  //Handles the scan of the qr code
  const handleScan = async (data) => {
    if (data) {
      setCode(data.text);
      alert("Scanned " + data.text + " successful!");
      await insertCode(data.text);
    }
  };

  //Allow the user to input manually
  const handleManualSearch = async () => {
    await insertCode(code);
  };

  //Inserts the code and checks its validity
  const insertCode = async (codeToInsert) => {
    if (!/^\d{4}$/.test(codeToInsert)) {
      setError("Code should be a four-digit number");
      return;
    }

    try {
      // Using the code to check for cart that contains the code
      const response = await fetch(
        `http://localhost:8082/api/completedCarts/code/${codeToInsert}`
      );
      const fetchedCart = await response.json();
      if (fetchedCart && fetchedCart._id) {
        setMessage(`Found cart with code ${codeToInsert}`);
        setCart(fetchedCart); // Set the cart state variable
      } else {
        setMessage(`No cart found with code ${codeToInsert}`);
        alert(`No cart found with code ${codeToInsert}`);
        setCart(null); // Clear the cart state variable
      }
    } catch (err) {
      setError(err.message);
    }
  };

  //Handles the email sending to the user
  const sendEmail = () => {
    // The actual contents of the email
    const emailParams = {
      email_from: cart.email,
      message:
        "Hey there " +
        cart.customerName +
        ", " +
        "Your order from " +
        cart.restaurant_name +
        " has been completed! \n\n" +
        "Thank you for ordering with Manage My Lunch! Please take the time to review your driver here: http://localhost:5173/OrderStatus.\n\n" +
        "We hope you enjoy your meal! \n\n",
    };

    // Send the email using the emailJS api keys
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
  };

  //Returns the content to be displayed to the page. Handles the user input and qr code scanning as well as displaying results
  return (
    <div>
      <div className="dashboard-section">
        <UserDashboard /> {/* Use UserDashboard */}
      </div>

      <div className="main-container">
        <div className="complete_order">
          <h2>Complete your order</h2>
          <hr />
          <p>
            Enter your order number to mark it as complete, or scan your qr code
            to mark as complete.
          </p>
          <input
            type="text"
            className="input-field"
            style={{ width: "50%" }}
            onChange={handleInputChange}
          />
          <button className="search-button" onClick={handleManualSearch}>
            Search
          </button>
          
          <div className="message-display">
            <p>{message}</p>
          </div>
          {cart && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="order-details" style={{ width: "50%" }}>
                <h3>Order Details:</h3>
                <p>Email: {cart.email}</p>
                <p>Restaurant: {cart.restaurant_name}</p>
                <p>Cost: ${cart.cost.toFixed(2)}</p>
                <p>Code: {cart.code}</p>
                <br></br>
                <br></br>
                <button className="complete-button" onClick={markComplete}>
                  Mark Complete
                </button>
              </div>
            </div>
          )}
          {/** The QR code window itself */}
          <QrReader onResult={handleScan} onError={handleError} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompleteOrder;
