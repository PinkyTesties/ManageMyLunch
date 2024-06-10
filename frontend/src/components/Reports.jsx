/**
Reports.jsx

This is the admin resport generation page. It fetches data from the backend API to display the most popular menu item, most popular restaurant, daily order count, receipts, and new users. 
The user can select a date to view the data for that specific date on Dailey order count, reciepts and users

Created by Tyler Costa 19075541
 */

// React imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
<<<<<<< HEAD
import logo from './componentAssets/logov1.png';
=======
// Header
import UserDashboard from './UserDashboard';
//Styles
import '../style/Reports.css'
// Footer
import Footer from './sharedComponents/Footer';

>>>>>>> origin/main

function Reports() {
    //Variables
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

    const [users, setUsers] = useState([]);

    //Fetches the total number of users
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

    //Fetches the most popular menu item
    const fetchPopularMenuItem = async () => {
        try {
            //Get all carts in completed Carts
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            const completedCarts = response.data;

            //Set the order count to the length of the completed carts
            setOrderCount(completedCarts.length);

            //Get all menu items from the completed carts
            let allMenuItems = [];
            completedCarts.forEach(cart => {
                allMenuItems = [...allMenuItems, ...cart.menuItems];
            });

            //Count the number of times each menu item appears
            const counts = allMenuItems.reduce((acc, value) => {
                if (!acc[value]) {
                    acc[value] = 0;
                }
                acc[value]++;
                return acc;
            }, {});

            //set the most popular menu item
            const popularMenuItem = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            setPopularItem(popularMenuItem);

            //Count the number of times the most popular menu item appears
            let count = 0;
            completedCarts.forEach(cart => {
                if (cart.menuItems.includes(popularMenuItem)) {
                    count++;
                }
            });

            setPopularItemCount(count);

            //Get the details of the most popular menu item
            const menuItemResponse = await axios.get(`http://localhost:8082/api/menuItems/${popularMenuItem}`);
            setPopularItemDetails(menuItemResponse.data);

            try {
                //Get the restaurant details of the most popular menu item
                const restaurantResponse = await axios.get(`http://localhost:8082/api/restaurants/${menuItemResponse.data.restaurant_id}`);
                setRestaurantDetails(restaurantResponse.data);
            } catch (error) {
                console.error('Failed to fetch restaurant details:', error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    //Fetches the most popular restaurant
    const fetchPopularRestaurant = async () => {
        try {
            //Get all carts in completed Carts
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            const completedCarts = response.data;

            //Get all restaurant IDs from the completed carts
            let allRestaurants = [];
            completedCarts.forEach(cart => {
                allRestaurants.push(cart.restaurant_id);
            });

            //Count the number of times each restaurant appears
            const counts = allRestaurants.reduce((acc, value) => {
                if (!acc[value]) {
                    acc[value] = 0;
                }
                acc[value]++;
                return acc;
            }, {});

            //Set the most popular restaurant
            const popularRestaurantId = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            setPopularRestaurantCount(counts[popularRestaurantId]);

            //Get the details of the most popular restaurant
            const restaurantResponse = await axios.get(`http://localhost:8082/api/restaurants/${popularRestaurantId}`);
            setPopularRestaurant(restaurantResponse.data);
        } catch (error) {
            console.error('Failed to fetch restaurant details:', error.response);
        }
    };

    //Fetches the order count for a specific date
    const fetchOrdersForDate = async (date) => {
        try {
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            const completedCarts = response.data;

            //Filter the completed carts to only include carts from the selected date
            const cartsForDate = completedCarts.filter(cart => {
                const cartDate = new Date(cart.date_created);
                return cartDate.getDate() === date.getDate() &&
                    cartDate.getMonth() === date.getMonth() &&
                    cartDate.getFullYear() === date.getFullYear();
            });

            //Set the order count to the number of carts for the selected date
            setOrderCount(cartsForDate.length);
        } catch (error) {
            console.error(error);
        }
    };

    //Handles the date change for the date picker
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

    //Fetches the total number of receipts on selected date
    useEffect(() => {
        fetchReceiptsForDate(selectedDate);
    }, [selectedDate]);


    //fetches all cinpleted carts and uses that to determine the total number of receipts
    useEffect(() => {
        const fetchAllReceipts = async () => {
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            setTotalReceipts(response.data.length);
        };

        fetchAllReceipts();
    }, []);

    //sets the daily receipts to the length of the receipts array 
    useEffect(() => {
        setDailyReceipts(receipts.length);
    }, [receipts]);

    //Fetches the total number of receipts on a specific date
    const fetchReceiptsForDate = async (date) => {
        try {
            const response = await axios.get('http://localhost:8082/api/completedCarts');
            const completedCarts = response.data;

            //Filter the completed carts to only include carts from the selected date
            const cartsForDate = completedCarts.filter(cart => {
                const cartDate = new Date(cart.date_created);
                return cartDate.getDate() === date.getDate() &&
                    cartDate.getMonth() === date.getMonth() &&
                    cartDate.getFullYear() === date.getFullYear();
            });

            //Set the order count to the number of carts for the selected date
            for (let cart of cartsForDate) {
                const menuItems = await Promise.all(cart.menuItems.map(async (itemId) => {
                    const response = await axios.get(`http://localhost:8082/api/menuItems/${itemId}`);
                    return response.data.name;
                }));
                cart.menuItems = menuItems;
            }

            //Set the receipts to the carts for the selected date
            setReceipts(cartsForDate);

        } catch (error) {
            console.error(error);
        }
    };

    //Fetches the total number of users created on a specific date
    const fetchUsersForDate = async (date) => {
        try {
            //Get all users
            const response = await axios.get('http://localhost:8082/api/users');
            const allUsers = response.data;

            //Filter the users to only include users from the selected date
            const usersForDate = allUsers.filter(user => {
                const userDate = new Date(user.date_added);
                return userDate.getDate() === date.getDate() &&
                    userDate.getMonth() === date.getMonth() &&
                    userDate.getFullYear() === date.getFullYear();
            });

            //Set the users to the users created to the selected date
            setUsers(usersForDate);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    // Render the page
    return (
        <div>
<<<<<<< HEAD
        <header><img src={logo} alt='Logo' height={100} />
                <h2>Admin report generation</h2>
                <p></p>
                </header>
                <hr />
        <div className='report'>
            <div>
                <div className='MenuButtons'>
                    <button onClick={() => { setPage('item'); fetchPopularMenuItem(); }}>Popular Menu Items</button>
                    <button onClick={() => { setPage('restaurant'); fetchPopularRestaurant(); }}>Popular Restaurants</button>
                    <button onClick={() => { setPage('QR'); }}>Successful QR Pickup</button>
                    <button onClick={() => { setPage('DailyOrderCount'); }}>Daily order count</button>
                    <button onClick={() => { setPage('Receipts'); }}>Receipts</button>
                    <button onClick={() => { setPage('NewUsers'); }}>New Users</button>
=======
            {/**Header */}
            <UserDashboard />
            <div className='report'>

                <div>
                    <h2>Admin Report Generation</h2>
                    <hr />
                    {/**Buttons */}
                    <div className='MenuButtons'>
                        <button onClick={() => { setPage('item'); fetchPopularMenuItem(); }}>Popular Menu Items</button>
                        <button onClick={() => { setPage('restaurant'); fetchPopularRestaurant(); }}>Popular Restaurants</button>
                        <button onClick={() => { setPage('QR'); }}>Successful QR Pickup</button>
                        <button onClick={() => { setPage('DailyOrderCount'); }}>Daily Order Count</button>
                        <button onClick={() => { setPage('Receipts'); }}>Receipts</button>
                        <button onClick={() => { setPage('NewUsers'); }}>Users</button>
                    </div>
>>>>>>> origin/main
                </div>

                {/** Popular menu items*/}
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

                {/** Popular restaurants*/}
                {page === 'restaurant' && popularRestaurant && (
                    <div className="receipt-container">
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

                {/** Successful QR pickup*/}
                {page === 'QR' && (
                    <div className="receipt-container">
                        <p>QR Code info goes here</p>
                    </div>
                )}

                {/** Order count on a specific date*/}
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

                {/**All receipts on a specific date */}
                {page === 'Receipts' && (
                    <div>
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
                    </div>
                )}

                {/**New users on a specific date */}
                {page === 'NewUsers' && (
                    <div>
                        <h4>Total users signed up to manage my lunch: {totalUsers}</h4>                      
                          <br />
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
                    </div>
                )}

            </div>
<<<<<<< HEAD
            {page === 'item' && popularItemDetails && (
                <>
                    <h5>Most popular item:</h5>
                    <p>{popularItemDetails.name}</p>
                    <p>ID: {popularItemDetails._id}</p>
                    <p>Price: ${popularItemDetails.cost}</p>
                    <p>Description: {popularItemDetails.item_desc}</p>
                    <p>Restaurant: {restaurantDetails ? restaurantDetails.restaurantName : 'N/A'}</p>
                    <p>Restaurant ID: {popularItemDetails.restaurant_id}</p>
                    <p>Completed orders counted: {orderCount}</p>
                    <p>Amount of times item "{popularItemDetails.name}" appears: {popularItemCount}</p>

                </>
            )}
            {page === 'restaurant' && popularRestaurant && (
                <>
                    <h5>Most popular restaurant:</h5>
                    <p>{popularRestaurant.restaurantName}</p>
                    <p>Restaurant ID: {popularRestaurant._id}</p>
                    <p>Rating: {popularRestaurant.rating} stars</p>
                    <p>Description: {popularRestaurant.description}</p>
                    <p>Appears in completed orders: {popularRestaurantCount} times</p>

                </>
            )}
            {page === 'QR' && (
                <>
                    <p>QR Code info goes here</p>

                </>
            )}
            {page === 'DailyOrderCount' && (
                <>
                    <h4>Daily Order Count</h4>
                    <br />
                    <div>
                        <label>Select a date:</label>
                        <DatePicker selected={selectedDate} onChange={handleDateChange} />
                    </div>
                    <br />
                    <br />
                    <h5>Total orders for selected date: {orderCount}</h5>


                </>
            )}
            {page === 'Receipts' && (
                <>
                    <h4>Total receipts: {totalReceipts}</h4>
                    <br />
                    <div>
                        <label>Select a date:</label>
                        <DatePicker selected={selectedDate} onChange={handleDateChange} />
                    </div>
                    <br />
                    <br />
                    <h5>Receipts for selected date: {dailyReceipts}</h5>
                    <div>
                        {receipts.map((receipt, index) => (
                            <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px', width: '300px'}}>
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
                    <h4>Total New Users</h4>
                    <br />
                    <div>
                        <label>Select a date:</label>
                        <DatePicker selected={selectedDate} onChange={handleDateChange} />
                    </div>
                    <br />
                    <br />
                    <h5>Users signed up on selected date: {users.length}</h5>
                    <div>
                        {users.map((user, index) => (
                            <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                                <p>Name: {user.name}</p>
                                <p>Email: {user.email}</p>
                                <p>University: {user.university}</p>
                                <p>Date Added: {new Date(user.date_added).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                </>
            )}
=======
            <Footer />
>>>>>>> origin/main
        </div>
        </div>
    );
}

export default Reports;
