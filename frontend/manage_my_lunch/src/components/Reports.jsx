import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    const [users, setUsers] = useState([]);

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
          console.error(error);
        }
      };

    useEffect(() => {
        if (page === 'NewUsers') {
            fetchUsersForDate(selectedDate);
        }
    }, [page, selectedDate]);

    return (
        <div>
            <div>
                <h2>Admin report generation</h2>
                <div>
                    <button onClick={() => { setPage('item'); fetchPopularMenuItem(); }}>Popular Menu Items</button>
                    <button onClick={() => { setPage('restaurant'); fetchPopularRestaurant(); }}>Popular Restaurants</button>
                    <button onClick={() => { setPage('QR'); }}>Successful QR Pickup</button>
                    <button onClick={() => { setPage('DailyOrderCount'); }}>Daily order count</button>
                    <button onClick={() => { setPage('Reciepts'); }}>Reciepts</button>
                    <button onClick={() => { setPage('NewUsers'); }}>New Users</button>
                </div>
            </div>
            {page === 'item' && popularItemDetails && (
                <>
                    <p>Most popular item: {popularItemDetails.name}</p>
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
                    <p>Most popular restaurant: {popularRestaurant.restaurantName}</p>
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
                    <p>Daily Order count info goes here</p>
                    <div>
                        <label>Select a date:</label>
                        <DatePicker selected={selectedDate} onChange={handleDateChange} />
                    </div>
                    <p>Total orders for selected date: {orderCount}</p>


                </>
            )}
            {page === 'Reciepts' && (
                <>
                    <p>Total receipts: {totalReceipts}</p>
                    <label>Select a date:</label>
                    <DatePicker selected={selectedDate} onChange={handleDateChange} />
                    <p>Receipts for selected date: {dailyReceipts}</p>

                    <div>
                        {receipts.map((receipt, index) => (
                            <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
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
                 <label>Select a date:</label>
                    <DatePicker selected={selectedDate} onChange={handleDateChange} />
                    <p>Users signed up on selected date: {users.length}</p>
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
        </div>
    );
}

export default Reports;
