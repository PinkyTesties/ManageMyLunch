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
  const [walletBalance, setWalletBalance] = useState(0);
  
  const [deliveryFee, setDeliveryFee] = useState(0); // State variable for delivery fee
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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

  const handleDelivered = (orderId, email) => {
    let deliveryFee = 0; // Define deliveryFee in the outer scope
  
    axios.put(`http://localhost:8082/api/completedCarts/status/${orderId}`, { orderStatus: 'Delivered' })
      .then(response => {
        // After updating the order status, fetch the order to get the delivery fee
        return axios.get(`http://localhost:8082/api/completedCarts/id/${orderId}`);
      })
      .then(response => {
        if (response.data) {
          deliveryFee = response.data.delivery_fee; // Update deliveryFee
          console.log(`Amount of: ${deliveryFee} added to driver wallet`);
          // Fetch the driver's current wallet balance
          return axios.get(`http://localhost:8082/api/drivers/email/${email}`);
        }
      })
      .then(response => {
        if (response.data) {
          // Calculate the new balance
          const newBalance = response.data.wallet_balance + deliveryFee;
          // Update the driver's wallet balance
          return axios.put(`http://localhost:8082/api/drivers/${response.data._id}`, { wallet_balance: newBalance });
        }
      })
      .then(response => {
        // Fetch the updated wallet balance
        return axios.get(`http://localhost:8082/api/drivers/email/${email}`);
      })
      .then(response => {
        if (response.data) {
          // Update the local walletBalance state variable
          setWalletBalance(response.data.wallet_balance);
        }
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
      <header className='header'>
        <img src={logo} alt="Logo" height={100} />
        <h1>Driver Dashboard</h1>
        <button onClick={toggleDropdown}>Account</button>
      </header>
      <hr />
      <p>
        Logged in as: {name} <br></br>
        Current earnings: ${walletBalance !== undefined ? walletBalance.toFixed(2) : 'Loading...'}
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
              <h2 className="display-4 text-center">Orders Available</h2>
              <br />
            </div>
            <div className='col-md-11'>
              <button onClick={handleAllOrdersClick}>All Available Orders</button>
              <button onClick={handleFilterByRestaurantClick}>
                Select By Restaurant
              </button>

              <button onClick={handleSelectedOrdersClick}>
                Selected Orders
              </button>
            </div>

            {page === "all-orders" && (

              <div className="ShowBookList">
                These are all the orders available for: {today.toDateString()}.
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
              <div>
                <div><h2>Select Batch Orders</h2></div>
                These are all the orders available for: {today.toDateString()}.

                <div>
                  {/* Display selected orders here */}
                  <div className="order-cards-container"> {RestaurantList}</div>
                </div>
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
                      marginBottom: "10px",
                      width: "250px"
                    }}
                  >
                    <p>Order ID: {order._id}</p>
                    <p>Restaurant Name: {order.restaurant_name}</p>
                    <p>Customer: {order.customerName}</p>
                    <p>Delivery Location: {order.delivery_location}</p>
                    <button onClick={() => handleDelivered(order._id, email)}>
                      Mark as Delivered
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
