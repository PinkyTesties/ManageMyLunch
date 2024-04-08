import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Driver_OrderPanel from "./Driver_OrderPanel";
import logo from "./componentAssets/logov1.png";
import RestaurantPanel_Driver from "./RestaurantPanel_Driver";
Modal.setAppElement("#root");

const Dashboard = ({ history }) => {
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

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
    // ... existing code ...
    setPage("all-orders");
  };

  const handleFilterByRestaurantClick = () => {
    // ... existing code ...
    setPage("batch-orders");
  };

  const handleSelectedOrdersClick = () => {
    // ... existing code ...
    setPage("selectedOrders");
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
        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          setUserID(res.data._id);
        } else {
          navigate("/DriversLogin");
        }
      })
      .catch((err) => console.log(err));
  }, []);

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

  const OrderList = orders.map(
    (
      order,
      k // Map over orders to create Driver_OrderPanel components
    ) => <Driver_OrderPanel order={order} key={k} />
  );

  const RestaurantList = restaurants.map(
    (
      restaurant,
      k // Map over orders to create Driver_OrderPanel components
    ) => <RestaurantPanel_Driver restaurant={restaurant} key={k} />
  );

  const handleDelivered = (orderId) => {
    axios.put(`http://localhost:8082/api/completedCarts/status/${orderId}`, { orderStatus: 'Delivered' })
      .then(response => {
        // Update the local state if necessary
        setSelectedOrders(selectedOrders.map(order => 
          order._id === orderId ? { ...order, orderStatus: 'Delivered' } : order
        ));
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };


  return (
    <div>
      <img src={logo} alt="Logo" height={100} />
      <h1>Driver Dashboard</h1>
      <p>***** CSS NOT DONE. DO NOT SUBMIT *****</p>

      <button onClick={toggleDropdown}>Account</button>
      <button className="header-button-right">
        <Link
          to={"/DriverLogin"}
          style={{ textDecoration: "none", color: "Black" }}
        >
          Logout
        </Link>
      </button>
      <p>
        Logged in as: {name}, {email}, {userID}
      </p>
      <Modal
        isOpen={showDropdown}
        onRequestClose={toggleDropdown}
        contentLabel="Account Menu"
        style={customStyles}
      >
        <a href="#">Profile</a>
        <br></br>

        <a href="/">Logout</a>
        <br></br>
      </Modal>

      <div className="ShowBookList">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <br />
              <h2 className="display-4 text-center">
                Orders available to assign
              </h2>
              <button onClick={handleAllOrdersClick}>All Orders</button>
              <button onClick={handleFilterByRestaurantClick}>
                Select By Restaurant
              </button>

              <button onClick={handleSelectedOrdersClick}>
                Selected Orders
              </button>
              <br></br>
              <br></br>

              {page === "all-orders" && (
                <div className="ShowBookList">
                  <div className="order-cards-container">
                    {OrderList.length === 0 ? (
                      <div className="alert alert-warning" role="alert">
                        No orders found.
                      </div>
                    ) : (
                      <div className="row">{OrderList}</div>
                    )}
                  </div>{" "}
                </div>
              )}

              {page === "batch-orders" && (
                <div className="order-cards-container">
                  <h2>Select Batch Orders</h2>
                  {/* Display selected orders here */}
                  <div> {RestaurantList}</div>
                </div>
              )}

              {page === "selectedOrders" && (
                <div className="selected-orders-section">
                  <h2>Selected Orders</h2>
                  {selectedOrders.map((order) => (
                    <div
                      key={order._id}
                      style={{
                        border: "1px solid black",
                        padding: "10px",
                        margin: "10px",
                      }}
                    >
                      <p>Order ID: {order._id}</p>
                      <p>Restaurant Name: {order.restaurant_name}</p>
                      <p>Customer: </p>
                      <button onClick={() => handleDelivered(order._id)}>
                        Delivered
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
