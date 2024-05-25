import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Driver_OrderPanel from "./Driver_OrderPanel";
import logo from "./componentAssets/logov1.png";
import RestaurantPanel_Driver from "./RestaurantPanel_Driver";
import emailjs from 'emailjs-com';
import "../style/DriverDashboard.css";
import Footer from "./sharedComponents/Footer";
const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [userID, setUserID] = useState("");
  const [orders, setOrders] = useState([]); // State variable for orders
  const [page, setPage] = useState("orders");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [orderStatus, setOrderStatus] = useState({});
  const [deliveryFee, setDeliveryFee] = useState(0); // State variable for delivery fee
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const [showDeliverButton, setShowDeliverButton] = useState(false);

  const handleCollectedClick = (orderId) => {
    setOrderStatus(prevStatus => ({
      ...prevStatus,
      [orderId]: 'Deliver Now'
    }));
  };

  const handleDeliverNowClick = (orderId) => {
    sendEmail();
    navigate(`/DeliverOrder/${orderId}`);
  };

  const customStyles = {
    content: {
      top: "0%",
      right: "0%",
      bottom: "auto",
      left: "auto",
      width: "20%",
      height: "50%",
    },
  };




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
          navigate("/DriverLogin");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (email) { // Only make the request if email is not an empty string
      axios.get(`http://localhost:8082/api/drivers/email/${email}`)
        .then(res => {
          setUserID(res.data._id);
          setWalletBalance(res.data.wallet_balance);
        })
        .catch(err => console.log(err));
    }
  }, [email]); // Add email as a dependency

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

  const handleAllOrdersClick = () => {
    setPage("all-orders");
  };

  const handleFilterByRestaurantClick = () => {
    setPage("batch-orders");
  };

  const handleSelectedOrdersClick = () => {
    setPage("selectedOrders");
  };

  useEffect(() => {
    const fetchOrders = () => {
      axios
        .get("http://localhost:8082/api/completedCarts") // Fetch completed carts
        .then((res) => {
          const pendingCarts = res.data.filter(
            (cart) => cart.orderStatus === "Pending"
          ); // Filter for 'Pending' carts
          setOrders(pendingCarts); // Set orders state variable
        })
        .catch((err) => {
          console.log("Error from DriverDashboard");
        });
    };

    // Fetch orders immediately and then every 5 seconds
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);


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

  // const OrderList = orders.map(
  //   (
  //     order,
  //     k // Map over orders to create Driver_OrderPanel components
  //   ) => <Driver_OrderPanel order={order} email={email} key={k} />  );

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison

  const OrderList = orders
    .filter(order => {
      const orderDate = new Date(order.delivery_date);
      orderDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison
      return orderDate.getTime() === today.getTime();
    })
    .map((order, k) => <Driver_OrderPanel order={order} email={email} key={k} />);

  const RestaurantList = restaurants.map(
    (
      restaurant,
      k // Map over orders to create Driver_OrderPanel components
    ) => <RestaurantPanel_Driver restaurant={restaurant} key={k} />
  );

  const sendEmail = () => {
    // Iterate over orders
    orders.forEach(order => {
      // Send email to customer
      const emailParams = {
        email_from: order.email,
        message:
          "Hey there " + order.customerName + ", " +
          "Your order from " + order.restaurant_name + " has been collected and is with our driver, " + name + "!\n\n" +
          "Your order will be delivered by " + name + " to " + order.delivery_location + " shorty, we will let you know once its been delivered. \n\n" +
          "Log in to Manage My Lunch at any time to view your order. \n\n"
      };

      emailjs.send('service_gmcskkn', 'template_v78bl21', emailParams, 'XfgsvummwbkF3G1dV')
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
        }, (err) => {
          console.log('FAILED...', err);
        });
    });
  };


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
        <p>
          Driver Logged in: {name} <br></br>
          Current earnings: ${walletBalance !== undefined ? walletBalance.toFixed(2) : 'Loading...'}
        </p>
      </div>

      <div className="container">
        <div className="row">

          <div className="masterContainer">

            <div >
              <button onClick={handleAllOrdersClick}>All Available Orders</button>
              <button onClick={handleFilterByRestaurantClick}>
                Select By Restaurant
              </button>

              <button onClick={handleSelectedOrdersClick}>
                Selected Orders
              </button>
            </div>

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

            {page === "batch-orders" && (
              <section>
                <h2>Select Batch Orders</h2>
                These are all the orders available for: {today.toDateString()}.
                <div className="order-cards-container"> {RestaurantList}</div>
              </section>
            )}

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
      <Footer />
    </div>
  );
};

export default Dashboard;
