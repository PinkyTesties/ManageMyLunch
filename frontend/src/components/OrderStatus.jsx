/*
OrderStatus.jsx

This page displays the users current and past orders
Current orders:
- The uesr can view the details and current status of their order (Pending, Accepted By Driver, Delivered)
- The user can edit their order if the order is still pending
- The user has 5 minutes to edit their order before the time elapses
- The user can confirm the order pickup if the order has been delivered, redirecting to the CompleteOrder page

Past orders:
- The user can view the details of their past orders
- The user can rate the restaurant and driver for each past order

Created by Tyler Costa 19075541 and Ranier
*/

// React imports
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//Styles
import "../style/EditButtonFix.css";
// Header
import UserDashboard from "./UserDashboard";
//Styles
import '../style/orderStatus.css';
// Footer
import Footer from "./sharedComponents/Footer";

function OrderStatus() {
  // Variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [userID, setUserID] = useState("");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalRemainingTimeInSeconds, setTotalRemainingTimeInSeconds] = useState(0);
  const [view, setView] = useState('current');

  const navigate = useNavigate();

  const prevTotalRemainingTimeInSeconds = useRef();

  useEffect(() => {
    prevTotalRemainingTimeInSeconds.current = totalRemainingTimeInSeconds;
  }, [totalRemainingTimeInSeconds]);

  useEffect(() => {
    if (totalRemainingTimeInSeconds === 0 && prevTotalRemainingTimeInSeconds.current > 0) {
      console.log('Edit time has elapsed.');
    }
  }, [totalRemainingTimeInSeconds]);

  // Fetch user details from session
  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          setUniversity(res.data.university);
          setUserID(res.data._id);
          fetchOrders(res.data.email);
        } else {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Fetch menu items for each order
  useEffect(() => {
    if (orders.length > 0) {
      const fetchMenuItems = async () => {
        const menuItemIds = orders.reduce(
          (ids, order) => [...ids, ...order.menuItems],
          []
        );
        const uniqueMenuItemIds = [...new Set(menuItemIds)];

        const fetchedMenuItems = await Promise.all(
          uniqueMenuItemIds.map((id) =>
            axios
              .get(`http://localhost:8082/api/menuItems/${id}`)
              .then((res) => res.data)
              .catch((err) => {
                console.error(err);
                return { _id: id, name: "Unknown menu item" };
              })
          )
        );

        const menuItemsMap = fetchedMenuItems.reduce((map, menuItem) => {
          map[menuItem._id] = menuItem.name;
          return map;
        }, {});

        setMenuItems(menuItemsMap);
      };

      fetchMenuItems();
    }
  }, [orders]);

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); 

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Fetch orders from the API using the user's email
  const fetchOrders = (email) => {
    axios
      .get(`http://localhost:8082/api/completedCarts/${email}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          console.error("API response is not an array");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Fetch orders every second, can be updated to fetch less frequently for performance
  useEffect(() => {
    const intervalId = setInterval(() => fetchOrders(email), 1000); 

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [email]); 

  // Render the page
  return (
    <div>
      <div>
<<<<<<< HEAD
        <header className="header">
          <img src={logo} alt="Logo" height={100} />
          <h1>Manage My Lunch Dashboard</h1>
          <p></p>
        </header>
        <hr />
        <p>
          Logged in as: {name}, {university}
        </p>
        <div className="MenuButtons">
          <button onClick={toggleDropdown}>Account</button>
          <button>
            <Link
              to={"/Dashboard"}
              style={{ textDecoration: "none", color: "Black" }}
            >
              Dashboard
            </Link>
          </button>
          <button>
            <Link to="/Cart" style={{ textDecoration: "none", color: "Black" }}>
              Cart
            </Link>
          </button>
        </div>
        <Modal
          isOpen={showDropdown}
          onRequestClose={toggleDropdown}
          contentLabel="Account Menu"
          className="my-modal"
        >
          <a href="#">Profile</a><br></br>
          <a href="SettingsPage">Settings</a><br></br>
          <a href="OrderStatus">Orders</a><br></br>
          <a href="/">Logout</a><br></br>
        </Modal>
=======
        {/**User dashboard */}
        <UserDashboard />

        <div className="cart-container-orderStatus">
          <div className="buttons">
            {/** Buttons to switch between page views */}
            <button className="statusButton" onClick={() => setView('current')}>Current Orders</button>
            <button className="statusButton" onClick={() => setView('past')}>Past Orders</button>
          </div>

          {/**Display current orders */}
          {view === 'current' ? (
            <div className="currentOrdersView">
            {/**Only displays orders that are delivered, accepted by driver, pending */}
              {orders
                .filter(
                  (order) =>
                    
                    order.orderStatus === "Delivered" ||
                    order.orderStatus == "Accepted By Driver" ||
                    order.orderStatus === "Pending"
                )
                .map((order, index) => {
>>>>>>> origin/main

                  // Convert the order date_created to Date object
                  const orderDate = new Date(order.date_created);
                  const year = orderDate.getFullYear();
                  const month = orderDate.getMonth();
                  const day = orderDate.getDate();

<<<<<<< HEAD
        <p>{/*Your order ID is: { }*/}</p>
        <h3>Current orders</h3>
        <div className="current-orders">
          {orders
            .filter(
              (order) =>
                order.orderStatus === "Delivered" ||
                order.orderStatus == "Accepted By Driver" ||
                order.orderStatus === "Pending"
            )
            .map((order, index) => {
              // Parse order.date_created to get the year, month, and day
              const orderDate = new Date(order.date_created);
              const year = orderDate.getFullYear();
              const month = orderDate.getMonth(); // Note: months are 0-based in JavaScript Date objects
              const day = orderDate.getDate();

              // Convert time_created to 24-hour format
              const [time, modifier] = order.time_created.split(" ");
              let [hours, minutes, seconds] = time.split(":");
              if (modifier === "PM" && hours !== "12") {
                hours = Number(hours) + 12;
              } else if (modifier === "AM" && hours === "12") {
                hours = "00";
              }

              hours = hours.toString(); // Convert hours back to a string

              const time24 = `${hours.padStart(2, "0")}:${minutes}:${seconds}`;

              // Create the orderTime Date object
              const orderTime = new Date(
                year,
                month,
                day,
                ...time24.split(":")
              );

              // Calculate the total remaining time in seconds
              const totalRemainingTimeInSeconds = Math.max(
                0,
                5 * 60 - (currentTime - orderTime) / 1000
              );

              // Calculate the remaining minutes and seconds
              const remainingMinutes = Math.floor(
                totalRemainingTimeInSeconds / 60
              );
              const remainingSeconds = Math.floor(
                totalRemainingTimeInSeconds % 60
              );

              return (
                <div
                  key={index}
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    margin: "10px",
                    width: "300px",
                    background: "#fff",

                  }}
                >
                  <h2>{order.restaurant_name}</h2>
                  <h3>Cost: ${order.cost.toFixed(2)}</h3>

                  {order.delivery_date.split("T")[0] !== new Date().toISOString().split("T")[0] &&
                    <p>Delivery Date: {order.delivery_date.split("T")[0]}
                      <br /> <i><b>This order will be fulfilled on the selected date.</b></i>
                    </p>

                  }
                  {order.delivery_date.split("T")[0] === new Date().toISOString().split("T")[0] &&
                    <p>Delivery Date: {order.delivery_date.split("T")[0]} (Today)</p>
=======
                  // Convert time_created to 24-hour format
                  const [time, modifier] = order.time_created.split(" ");
                  let [hours, minutes, seconds] = time.split(":");
                  if (modifier === "PM" && hours !== "12") {
                    hours = Number(hours) + 12;
                  } else if (modifier === "AM" && hours === "12") {
                    hours = "00";
>>>>>>> origin/main
                  }

                  //Convert hours to string
                  hours = hours.toString();

                  // Format the time to HH:MM:SS
                  const time24 = `${hours.padStart(2, "0")}:${minutes}:${seconds}`;

                  // Create the orderTime Date object
                  const orderTime = new Date(
                    year,
                    month,
                    day,
                    ...time24.split(":")
                  );

                  // Calculate the total remaining time in seconds
                  const totalRemainingTimeInSeconds = Math.max(
                    0,
                    5 * 60 - (currentTime - orderTime) / 1000
                  );

                  // Calculate the remaining minutes and seconds
                  const remainingMinutes = Math.floor(
                    totalRemainingTimeInSeconds / 60
                  );
                  const remainingSeconds = Math.floor(
                    totalRemainingTimeInSeconds % 60
                  );

                  // Return the order status container with the order details
                  return (
                    <div className="completed-order-container-orderStatus"
                      key={index}

                    >
                      <h1>Order From {order.restaurant_name}</h1>

                      <h3>Cost: ${order.cost.toFixed(2)}</h3>
                      <p>Thank you for your order!</p>
                      <br></br>
                      <p>{order.email}</p>
                      <p>
                        Menu Items:{" "}
                        {order.menuItems
                          .map((id) => menuItems[id] || id)
                          .join(", ")}
                      </p>
                      <p>Additional Info: {order.additionalInfo}</p>
                      <p>Status: {order.orderStatus}</p>
                      <p>Order code: {order.code}</p>
                      <p>Driver contact: {order.driver_email}</p>

                      <p></p>
                      {/**On;y display the editable button if remaining time is greater than > 0 */}
                      {totalRemainingTimeInSeconds > 0 ? (
                        <Link to={`/EditOrder/${order._id}`}>
                          <button className="edit-button">Edit Order</button>
                        </Link>
                      ) : (

                        <button disabled className="edit-button disabled">
                          Edit Order
                        </button>
                      )}
                      {/**Display the remaining time if the order is still pending, 
                       * else display the time elapsed message
                       */}
                      {totalRemainingTimeInSeconds > 0
                        ? ` Time Remaining: ${remainingMinutes} minutes ${remainingSeconds} seconds`
                        : " Edit Time has elapsed"}
                      {
                
                        order.orderStatus === "Delivered" && (
                          
                          <button className='pickup-button' onClick={() => navigate(`/CompleteOrder`)}>
                            Confirm Order Pickup
                          </button>
                        )
                      }
                    </div>
                  );
                })}
            </div>
          ) : (

            <div className="currentOrdersView">
            {/**Display title container */}

              <div className="completed-order-container-orderStatus">
                <h3>Your previous orders</h3>

              </div>
              

            {/**Display past orders */}

                {orders
                  .filter((order) => order.orderStatus === "Completed")
                  .map((order, index) => (
                    <div className="completed-order-container-orderStatus">
                    <div
                      key={index}

                    >
                      <h2>{order.restaurant_name}</h2>
                      <h2>Cost: ${order.cost.toFixed(2)}</h2>

                      <p>Email: {order.email}</p>
                      <p>
                        Menu Items:{" "}
                        {order.menuItems.map((id) => menuItems[id] || id).join(", ")}
                      </p>
                      <p>Additional Info: {order.additionalInfo}</p>
                      <p>Status: {order.orderStatus}</p>

                      {/** Buttons to review the restauant or driver */}
                      <button className='reviewButton' onClick={() => navigate(`/ReviewForm/${order.restaurant_id}`)}>
                        Rate this Restaurant
                      </button>
                      <button className='reviewButton' onClick={() => navigate(`/DriverReviewForm/${order.driver_email}`)}>
                        Rate your Driver
                      </button>
                    </div>
            </div>

                  ))}
              </div>

          )}

<<<<<<< HEAD
                  <p></p>
                  {totalRemainingTimeInSeconds > 0 ? (
                    <Link to={`/EditOrder/${order._id}`}>
                      <button className="edit-button">Edit Order</button>
                    </Link>
                  ) : (
                    <button disabled className="edit-button disabled">
                      Edit Order
                    </button>
                  )}
                  {totalRemainingTimeInSeconds > 0
                    ? ` Time Remaining: ${remainingMinutes} minutes ${remainingSeconds} seconds`
                    : " Edit Time has elapsed"}
                  {order.orderStatus === "Delivered" && (
                    <button onClick={() => navigate(`/CompleteOrder`)}>
                      Confirm Order Pickup
                    </button>
                  )}
                </div>
              );
            })}   
=======
>>>>>>> origin/main
        </div>
      </div>

      {/**Footer */}
      <Footer />

    </div>
  );
}

export default OrderStatus;