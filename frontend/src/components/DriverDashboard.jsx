/*
DriverDashboard.jsx
This is the main page for the driver. It displays all the orders available for the driver to accept. 
The driver can accept the orders by restaurant or select the orders they want to deliver.

The driver can also view their current earnings and logout from this page.
The page renders rhe Driver_OrderPanel component to display the order details to the driver.
The page also renders the RestaurantPanel_Driver component to display the restaurant details to the driver.

Created by Tyler Costa 19075541
*/

//React imports
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
//Import Driver_OrderPanel
import Driver_OrderPanel from "./Driver_OrderPanel";
//Import logo
import logo from "./componentAssets/logov1.png";
//Import RestaurantPanel_Driver
import RestaurantPanel_Driver from "./RestaurantPanel_Driver";
//Import emailjs
import emailjs from 'emailjs-com';
//Styles
import "../style/DriverDashboard.css";
//Import Footer
import Footer from "./sharedComponents/Footer";

const Dashboard = () => {
  //Variables
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState("orders");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [orderStatus, setOrderStatus] = useState({});
  const navigate = useNavigate();

  const [showDeliverButton, setShowDeliverButton] = useState(false);

  //Function to handle collected click
  const handleCollectedClick = (orderId) => {
    setOrderStatus(prevStatus => ({
      ...prevStatus,
      [orderId]: 'Deliver Now'
    }));
  };

  //Function to handle deliver now click
  const handleDeliverNowClick = (orderId) => {
    //send email to customer
    sendEmail();
    //Redirect to DeliverOrder page where the driver views the map to delivery location
    navigate(`/DeliverOrder/${orderId}`);
  };

  //Fetch and set the driver's name and email from session
  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        console.log(res.data); // Log the response data
        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          setUserID(res.data._id);
        } else {
          // If the user is not logged in, redirect to the login page
          navigate("/DriverLogin");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //Fetch the driver's wallet balance
  useEffect(() => {
    if (email) { 
      axios.get(`http://localhost:8082/api/drivers/email/${email}`)
        .then(res => {
          setUserID(res.data._id);
          setWalletBalance(res.data.wallet_balance);
        })
        .catch(err => console.log(err));
    }
    //inlcuded email as dependeciy because sometimes useEffect is called too early before email is fetched
  }, [email]); 

  //Fetch the orders
  useEffect(() => {
    axios
      .get("http://localhost:8082/api/restaurants")
      .then((res) => {
        setRestaurants(res.data);
      })
      .catch((err) => {
        console.log("Error from Dashboard");
      });
  }, []);

  //Change the page to all orders
  const handleAllOrdersClick = () => {
    setPage("all-orders");
  };

  //Change the page to batch orders
  const handleFilterByRestaurantClick = () => {
    setPage("batch-orders");
  };

  //Change the page to selected orders
  const handleSelectedOrdersClick = () => {
    setPage("selectedOrders");
  };

  //Fetch the orders with status 'pending'
  useEffect(() => {
    const fetchOrders = () => {
      axios
        .get("http://localhost:8082/api/completedCarts")
        .then((res) => {
          const pendingCarts = res.data.filter(
            (cart) => cart.orderStatus === "Pending"
          );
          // Set the orders to the pending carts
          setOrders(pendingCarts);
        })
        .catch((err) => {
          console.log("Error from DriverDashboard");
        });
    };

    // Fetch orders immediately and then refresh every second, we can update this to a longer time if needed for performance
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  //Fetch the selected orders with status 'Accepted By Driver' 
  useEffect(() => {
    if (page === "selectedOrders") {
      axios
        .get("http://localhost:8082/api/completedCarts/status/Accepted%20By%20Driver")
        .then((response) => {
          // Check if the response data is an array before setting the state
          if (Array.isArray(response.data)) {
            setSelectedOrders(response.data);
          } else if (response.data && response.data.message === 'No completed carts found for this status') {
            // If the response data is an object with a message property, set selectedOrders to an empty array
            setSelectedOrders([]);
          } else {
            console.error('Unexpected response data:', response.data);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }, [page, selectedOrders]);


  const today = new Date();
  today.setHours(0, 0, 0, 0);

  //Get the orders for today only
  const OrderList = orders
    .filter(order => {
      const orderDate = new Date(order.delivery_date);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    })
    .map((order, k) => <Driver_OrderPanel order={order} email={email} key={k} />);

  const RestaurantList = restaurants.map(
    (
      restaurant,
      k // Map over orders to create Driver_OrderPanel components similar to the dashboard in the customer side
    ) => <RestaurantPanel_Driver restaurant={restaurant} key={k} />
  );

  //Function to send email to customer
  const sendEmail = async () => {
    // Fetch user's email preference
    const fetchUserEmailPreference = async (email) => {
      const response = await fetch(`http://localhost:8082/api/users/email/${email}`);
      const data = await response.json();
      return data.emailAfterDriverCollection;
    };
  
    for (const order of orders) {
      const emailAfterDriverCollection = await fetchUserEmailPreference(order.email);
  
      // If user does not want to receive emails, skip this order
      if (!emailAfterDriverCollection) {
        continue;
      }
  
      // Send email to customer
      const emailParams = {
        email_from: order.email,
        message:
          "Hey there " + order.customerName + ", " +
          "Your order from " + order.restaurant_name + " has been collected and is with our driver, " + name + "!\n\n" +
          "Your order will be delivered by " + name + " to " + order.delivery_location + " shorty, we will let you know once its been delivered. \n\n" +
          "Log in to Manage My Lunch at any time to view your order. \n\n"
      };
  
      // Send email using emailjs api
      emailjs.send('service_gmcskkn', 'template_v78bl21', emailParams, 'XfgsvummwbkF3G1dV')
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
        }, (err) => {
          console.log('FAILED...', err);
        });
    }
  };

  //Render the DriverDashboard
  return (
    <div>
      <header className='header'>
        <img src={logo} alt="Logo" height={100} />
        <h1>Driver Dashboard</h1>
        <button onClick={() => navigate('/')}>Logout</button>
      </header>
      <hr />
      <h2 className="display-4 text-center">Orders Available</h2>
      <br />
      <div className="masterContainer">
        {/* Display the driver's name and wallet balance */}
        <p>
          Driver Logged in: {name} <br></br>
          Current earnings: ${walletBalance !== undefined ? walletBalance.toFixed(2) : 'Loading...'}
        </p>
      </div>

      <div>
        <div>

          <div className="masterContainer">

          <div >
            {/* Display controls to change the page */}
              <button onClick={handleAllOrdersClick}>All Available Orders</button>
              <button onClick={handleFilterByRestaurantClick}>
                Select By Restaurant
              </button>

              <button onClick={handleSelectedOrdersClick}>
                Selected Orders
              </button>
            </div>

            {/**All orders */}
            {page === "all-orders" && (
              <section >
                <div className="date-text">
                  These are all the orders available for: {today.toDateString()}.
                  <br></br>
                </div>
                <div className="order-cards-container">
                  <br></br>
                  {OrderList.length === 0 ? (
                    <div className="alert alert-warning" role="alert">
                      No orders found.
                    </div>
                  ) : (
                    <div className="row">{OrderList}</div>
                  )}
                </div>
              </section>
            )}

            {/**Batch orders */}
            {page === "batch-orders" && (
              <section>
                <h2>Select Batch Orders</h2>
                These are all the orders available for: {today.toDateString()}.
                <div className="order-cards-container"> {RestaurantList}</div>
              </section>
            )}

            {/**Selected Orders */}
            {page === "selectedOrders" && (
              <div className="selected-orders-section">
                <h2>Selected Orders</h2>
                {selectedOrders.map((order) => (
                  <div key={order._id} className="order-card">
                    <p>Order ID: {order._id}</p>
                    <p>Restaurant Name: {order.restaurant_name}</p>
                    <p>Customer: {order.customerName}</p>
                    <p>Delivery Location: {order.delivery_location}</p>
                    <div className="order-actions">
                      {orderStatus[order._id] === 'Deliver Now' ? (
                        <button onClick={() => handleDeliverNowClick(order._id)}>
                          Deliver Now
                        </button>
                      ) : (
                        orderStatus[order._id] !== 'Collected' &&
                        <button onClick={() => handleCollectedClick(order._id)}>
                          Collected
                        </button>
                      )}
                      {showDeliverButton && <button onClick={() => handleDeliverNowClick(order._id)}>Deliver Now</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/**Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
