import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./EditButtonFix.css";
import { Link } from "react-router-dom";
import logo from "./componentAssets/logov1.png";
import { useNavigate } from "react-router-dom";
import { pushNotification } from './jsFiles/pushNotifications';

import { differenceInSeconds } from 'date-fns'; // Import this function


Modal.setAppElement("#root");

function OrderStatus() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [userID, setUserID] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [totalRemainingTimeInSeconds, setTotalRemainingTimeInSeconds] = useState(0);

  //const uniqueMenuItemIds = [...new Set(menuItemIds)];

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const prevTotalRemainingTimeInSeconds = useRef();

  useEffect(() => {
    prevTotalRemainingTimeInSeconds.current = totalRemainingTimeInSeconds;
  }, [totalRemainingTimeInSeconds]);

  useEffect(() => {
    if (totalRemainingTimeInSeconds === 0 && prevTotalRemainingTimeInSeconds.current > 0) {
      console.log('Edit time has elapsed.');
    }
  }, [totalRemainingTimeInSeconds]);

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

  //This updates the date and time every second
  // useEffect(() => {
  //     const timer = setInterval(() => {
  //         setIsButtonDisabled(true);

  //         setCurrentTime(new Date());
  //     }, 1000); // Update every second

  //     // Cleanup function to clear the interval when the component unmounts
  //     return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    const intervalId = setInterval(() => fetchOrders(email), 1000); // Fetch every second

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [email]); // Depend on email prop

  return (
    <>
      <div>
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

        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>
          Your order has been placed successfully and is now being processed.
        </p>
        <p>We will send you an email confirmation shortly.</p>

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
                  }

                  <p>
                    Order Contents:{" "}
                    {order.menuItems
                      .map((id) => menuItems[id] || id)
                      .join(", ")}
                  </p>

                  {order.additionalInfo !== "" ? (
                    <p>Additional Info: {order.additionalInfo}</p>
                  ) : (
                    <p>No additional information</p>
                  )}
                  <p>Status: {order.orderStatus}</p>


                  {/*<p>Driver contact: {order.driver_email}</p>*/}

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
        </div>
      </div>

      <div>
        <h3>Order history</h3>
        {orders
          .filter((order) => order.orderStatus === "Completed")
          .map((order, index) => (
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
              <h2>Restaurant Name: {order.restaurant_name}</h2>
              <h2>Cost: ${order.cost.toFixed(2)}</h2>
              <p>Email: {order.email}</p>
              <p>
                Menu Items:{" "}
                {order.menuItems.map((id) => menuItems[id] || id).join(", ")}
              </p>
              <p>Additional Info: {order.additionalInfo}</p>
              <p>Status: {order.orderStatus}</p>
              <button>
                <Link to={`/ReviewForm/${order.restaurant_id}`}>
                  Rate this Restaurant
                </Link>
              </button>
              <button>
                <Link to={`/DriverReviewForm/${order.driver_email}`}>
                  Rate your Driver
                </Link>

              </button>
            </div>
          ))}
      </div>
    </>
  );
}

export default OrderStatus;
