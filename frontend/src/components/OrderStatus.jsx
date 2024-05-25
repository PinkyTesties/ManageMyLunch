import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./EditButtonFix.css";
import { Link } from "react-router-dom";
import logo from "./componentAssets/logov1.png";
import { useNavigate } from "react-router-dom";
import { pushNotification } from './jsFiles/pushNotifications';
import UserDashboard from "./UserDashboard";
import { differenceInSeconds } from 'date-fns'; // Import this function
import '../style/orderStatus.css'; // Make sure to create and import this CSS file
import Footer from "./sharedComponents/Footer";

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
  const [view, setView] = useState('current');

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
        <UserDashboard />


        <p>{/*Your order ID is: { }*/}</p>

        <div className="cart-container-orderStatus">
          <div className="buttons">
            <button className="statusButton" onClick={() => setView('current')}>Current Orders</button>
            <button className="statusButton" onClick={() => setView('past')}>Past Orders</button>
          </div>

          {view === 'current' ? (
            <div className="currentOrdersView">
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
                    <div className="completed-order-container-orderStatus"
                      key={index}

                    >

                      <h1>Order From {order.restaurant_name}</h1>

                      <h3>Cost: ${order.cost.toFixed(2)}</h3>
                      <p>Thank you for your order!</p>
                      <br></br>
                      <p>{order.email}</p>
                      {/* Display the "Edit Order" button if the difference in minutes is less than or equal to 5 */}
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
                      {
                        order.orderStatus === "Delivered" && (
                          <button className='pickup-button' onClick={() => navigate(`/CompleteOrder`)}>
                            Confirm Order Pickup
                          </button>
                        )

                        //<button onClick={() => navigate(`/CompleteOrder/${order._id}`)}>Confirm Order Pickup</button>
                      }
                    </div>
                  );
                })}
            </div>
          ) : (

            <div className="currentOrdersView">

              <div className="completed-order-container-orderStatus">
                <h3>Your previous orders</h3>

              </div>
              <div className="completed-order-container-orderStatus">

                {orders
                  .filter((order) => order.orderStatus === "Completed")
                  .map((order, index) => (
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

                      <button className='reviewButton' onClick={() => navigate(`/ReviewForm/${order.restaurant_id}`)}>
                        Rate this Restaurant
                      </button>
                      <button className='reviewButton' onClick={() => navigate(`/DriverReviewForm/${order.driver_email}`)}>
                        Rate your Driver
                      </button>
                    </div>
                  ))}
              </div>
            </div>

          )}




        </div>
      </div>

      <Footer />

    </>
  );
}

export default OrderStatus;