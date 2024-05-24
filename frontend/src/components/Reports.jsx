import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import UserDashboard from './UserDashboard'; // Import UserDashboard
import '../style/Reports.css'
//import UserDashboard from './UserDashboard';
import Footer from './sharedComponents/Footer';


function Reports() {
    const [popularItem, setPopularItem] = useState(null);
    const [orderCount, setOrderCount] = useState(null);
    const [popularItemCount, setPopularItemCount] = useState(null);
    const [popularItemDetails, setPopularItemDetails] = useState(null);
    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [popularRestaurant, setPopularRestaurant] = useState(null);
    const [page, setPage] = useState('item');
    const [popularRestaurantCount, setPopularRestaurantCount] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [receipts, setReceipts] = useState([]);
    const [totalReceipts, setTotalReceipts] = useState(0);
    const [dailyReceipts, setDailyReceipts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

// Add this to your existing state variables
const [users, setUsers] = useState([]);


// Add this useEffect hook to fetch the total number of users when the component mounts
useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/users');
        if (Array.isArray(response.data)) {
          setTotalUsers(response.data.length);
        } else {
          console.error('API did not return an array');
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    fetchTotalUsers();
  }, []);

    const fetchPopularMenuItem = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            const completedCarts = response.data;

            setOrderCount(completedCarts.length);

            let allMenuItems = [];
            completedCarts.forEach(cart => {
                allMenuItems = [...allMenuItems, ...cart.menuItems];
            });

            const counts = allMenuItems.reduce((acc, value) => {
                if (!acc[value]) {
                    acc[value] = 0;
                }
                acc[value]++;
                return acc;
            }, {});

            const popularMenuItem = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

            setPopularItem(popularMenuItem);

            let count = 0;
            completedCarts.forEach(cart => {
                if (cart.menuItems.includes(popularMenuItem)) {
                    count++;
                }
            });

            setPopularItemCount(count);

            const menuItemResponse = await axios.get(`http://localhost:8082/api/menuItems/${popularMenuItem}`);
            setPopularItemDetails(menuItemResponse.data);

            try {
                const restaurantResponse = await axios.get(`http://localhost:8082/api/restaurants/${menuItemResponse.data.restaurant_id}`);
                setRestaurantDetails(restaurantResponse.data);
            } catch (error) {
                console.error('Failed to fetch restaurant details:', error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPopularRestaurant = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            const completedCarts = response.data;

            let allRestaurants = [];
            completedCarts.forEach(cart => {
                allRestaurants.push(cart.restaurant_id);
            });

            const counts = allRestaurants.reduce((acc, value) => {
                if (!acc[value]) {
                    acc[value] = 0;
                }
                acc[value]++;
                return acc;
            }, {});

            const popularRestaurantId = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

            setPopularRestaurantCount(counts[popularRestaurantId]);

            const restaurantResponse = await axios.get(`http://localhost:8082/api/restaurants/${popularRestaurantId}`);
            setPopularRestaurant(restaurantResponse.data);
        } catch (error) {
            console.error('Failed to fetch restaurant details:', error.response);
        }
    };

    const fetchOrdersForDate = async (date) => {
        try {
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            const completedCarts = response.data;

            const cartsForDate = completedCarts.filter(cart => {
                const cartDate = new Date(cart.date_created);
                return cartDate.getDate() === date.getDate() &&
                    cartDate.getMonth() === date.getMonth() &&
                    cartDate.getFullYear() === date.getFullYear();
            });

            setOrderCount(cartsForDate.length);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (page === 'Reciepts') {
            fetchReceiptsForDate(date);
        } else if (page === 'DailyOrderCount') {
            fetchOrdersForDate(date);
        } else if (page === 'NewUsers') {
            fetchUsersForDate(date);
        }
    };

    useEffect(() => {
        fetchReceiptsForDate(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        const fetchAllReceipts = async () => {
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            setTotalReceipts(response.data.length);
        };

        fetchAllReceipts();
    }, []);

    useEffect(() => {
        setDailyReceipts(receipts.length);
    }, [receipts]);

    const fetchReceiptsForDate = async (date) => {
        try {
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            const completedCarts = response.data;

            const cartsForDate = completedCarts.filter(cart => {
                const cartDate = new Date(cart.date_created);
                return cartDate.getDate() === date.getDate() &&
                    cartDate.getMonth() === date.getMonth() &&
                    cartDate.getFullYear() === date.getFullYear();
            });

            for (let cart of cartsForDate) {
                const menuItems = await Promise.all(cart.menuItems.map(async (itemId) => {
                    const response = await axios.get(`http://localhost:8082/api/menuItems/${itemId}`);
                    return response.data.name;
                }));
                cart.menuItems = menuItems;
            }

            setReceipts(cartsForDate);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsersForDate = async (date) => {
        try {
            const response = await axios.get('http://localhost:8082/api/users');
            const allUsers = response.data;

            const usersForDate = allUsers.filter(user => {
                const userDate = new Date(user.date_added);
                return userDate.getDate() === date.getDate() &&
                    userDate.getMonth() === date.getMonth() &&
                    userDate.getFullYear() === date.getFullYear();
            });

            setUsers(usersForDate);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    return (
        <>
            <UserDashboard />
            <div className='report'>

                <div>
                    <h2>Admin Report Generation</h2>
                    <hr />
                    <div className='MenuButtons'>
                        <button onClick={() => { setPage('item'); fetchPopularMenuItem(); }}>Popular Menu Items</button>
                        <button onClick={() => { setPage('restaurant'); fetchPopularRestaurant(); }}>Popular Restaurants</button>
                        <button onClick={() => { setPage('QR'); }}>Successful QR Pickup</button>
                        <button onClick={() => { setPage('DailyOrderCount'); }}>Daily Order Count</button>
                        <button onClick={() => { setPage('Receipts'); }}>Receipts</button>
                        <button onClick={() => { setPage('NewUsers'); }}>Users</button>
                    </div>
                </div>
                {page === 'item' && popularItemDetails && (
                    <div>
                    <p>These are the details on the currently most ordered food item on the Manage My Lunch platform. </p>
                    <div className="receipt-container">
                        <h5>Most popular item:</h5>
                        <p>{popularItemDetails.name} (ID: {popularItemDetails._id})</p>
                        <p>Price: ${popularItemDetails.cost.toFixed(2)}</p>
                        <p>Description: {popularItemDetails.item_desc}</p>
                        <br></br><p>This item is sold by the restaurant: {restaurantDetails ? restaurantDetails.restaurantName : 'N/A'} (ID: {popularItemDetails.restaurant_id})</p>
                        <br></br><p>Completed orders searched: {orderCount}</p>
                        <p>Amount of times item "{popularItemDetails.name}" appears: {popularItemCount}</p>
                    </div>
                    </div>
                )}
                {page === 'restaurant' && popularRestaurant && (
                    <div>
                    <h5>Most popular restaurant:</h5>
                    <p>These are the details of the current most popular restaurant on Manage My Lunch</p>
                    <div className="receipt-container">
                        <p>{popularRestaurant.restaurantName}</p>
                        <p>Restaurant ID: {popularRestaurant._id}</p>
                        <br></br>
                        <p>Rating: {popularRestaurant.rating} stars</p>
                        <p>Description: {popularRestaurant.description}</p>
                        <br></br>
                        <p>Appears in completed orders: {popularRestaurantCount} times</p>
                    </div>
                    
                    </div>
                )}
                {page === 'QR' && (
                    <div className="receipt-container">
                    <p>QR Code info goes here</p>
                    </div>
                )}
                {page === 'DailyOrderCount' && (
                    <div>
                    <h4>Order count on a specified date</h4>

                    <div className="receipt-container">
                        <br />
                        <div>
                            <label>Select a date:</label>
                            <DatePicker selected={selectedDate} onChange={handleDateChange} />
                        </div>
                        <br />
                        <h5>Total orders for selected date: {orderCount}</h5>
                    </div>
                    </div>
                )}
                {page === 'Receipts' && (
                    <>
                        <h4>Total Receipts: {totalReceipts}</h4>
                        <br />
                        <div>
                            <label>Select a date:</label>
                            <DatePicker selected={selectedDate} onChange={handleDateChange} />
                        </div>
                        <br />
                        <h5>Receipts for selected date: {dailyReceipts}</h5>
                        <div>
                            {receipts.map((receipt, index) => (
                                <div key={index} className="receipt-container">
                                    <p>Cart ID: {receipt._id}</p>
                                    <p>Restaurant ID: {receipt.restaurant_id}</p>
                                    <p>Menu Items: {Array.isArray(receipt.menuItems) && receipt.menuItems.length > 0 ? receipt.menuItems.join(', ') : 'No menu items'}</p>
                                    <p>Date Created: {new Date(receipt.date_created).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {page === 'NewUsers' && (
                    <>
<h4>Total users signed up to manage my lunch: {totalUsers}</h4>                        <br />
                        <div>
                            <label>Select a date:</label>
                            <DatePicker selected={selectedDate} onChange={handleDateChange} />
                        </div>
                        <br />
                        <h5>Users signed up on selected date: {users.length}</h5>
                        <div>
                            {users.map((user, index) => (
                                <div key={index} className="user-container">
                                    <p>Name: {user.name}</p>
                                    <p>Email: {user.email}</p>
                                    <p>University: {user.university}</p>
                                    <p>Date Added: {new Date(user.date_added).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>
            <Footer />
        </>
    );
}

export default Reports;
