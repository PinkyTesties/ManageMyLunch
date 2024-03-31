import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal';

import { Link } from "react-router-dom";
import logo from "./componentAssets/logov1.png";
import { useNavigate } from "react-router-dom";
Modal.setAppElement('#root');

function OrderStatus() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [university, setUniversity] = useState('');
    const [userID, setUserID] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const [currentTime, setCurrentTime] = useState(new Date());

    //const uniqueMenuItemIds = [...new Set(menuItemIds)];

    const navigate = useNavigate();

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const customStyles = {
        content: {
            top: '0%',
            right: '0%',
            bottom: 'auto',
            left: 'auto',
            width: '20%',
            height: '50%',
        },
    };


    useEffect(() => {
        axios.get('http://localhost:8082')
            .then((res) => {
                if (res.data.valid) {
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setUniversity(res.data.university);
                    setUserID(res.data._id);
                    fetchOrders(res.data.email);
                } else {
                    navigate('/');
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (orders.length > 0) {
            const fetchMenuItems = async () => {
                const menuItemIds = orders.reduce((ids, order) => [...ids, ...order.menuItems], []);
                const uniqueMenuItemIds = [...new Set(menuItemIds)];

                const fetchedMenuItems = await Promise.all(uniqueMenuItemIds.map(id =>
                    axios.get(`http://localhost:8082/api/menuItems/${id}`)
                        .then(res => res.data)
                        .catch(err => {
                            console.error(err);
                            return { _id: id, name: 'Unknown menu item' };
                        })
                ));

                const menuItemsMap = fetchedMenuItems.reduce((map, menuItem) => {
                    map[menuItem._id] = menuItem.name;
                    return map;
                }, {});

                setMenuItems(menuItemsMap);
            };

            fetchMenuItems();
        }
    }, [orders]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(timer);
    }, []);


    const fetchOrders = (email) => {
        axios.get(`http://localhost:8082/api/completedCarts/${email}`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    setOrders(res.data);
                } else {
                    console.error('API response is not an array');
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <><div>
            <img src={logo} alt='Logo' height={100} />
            <h1>Manage My Lunch Dashboard</h1>
            <p>***** CSS NOT DONE. DO NOT SUBMIT *****</p>

            <button onClick={toggleDropdown}>Account</button>
            <button className='header-button-right'><Link to={'/Cart'} style={{ textDecoration: 'none', color: 'Black' }}>Cart</Link></button>
            <button className='header-button-right'><Link to={'/'} style={{ textDecoration: 'none', color: 'Black' }}>Logout</Link></button>
            <p>Logged in as: {name}, {university}, {email}, {userID}</p>
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
            <p>Your order has been placed successfully and is now being processed.</p>
            <p>We will send you an email confirmation shortly.</p>
            <p>{/*Your order ID is: { }*/}</p>
            <div>
                <h3>Current orders</h3>
                {/* Here is where you might display the orders */}
                {orders.filter(order => order.orderStatus === 'Pending').map((order, index) => {
                    // Get the current time in NZDT
                    const currentTime = new Date();

                    const [time, modifier] = order.time_created.split(' ');
                    let [hours, minutes, seconds] = time.split(':');
                    if (modifier === 'PM' && hours !== '12') {
                        hours = Number(hours) + 12;
                    }
                    const time24 = `${hours}:${minutes}:${seconds}`;

                    // Get the order creation time in NZDT
                    const orderTime = new Date(order.date_created.split('T')[0] + 'T' + time24 + '+13:00');

                    // Calculate the total remaining time in seconds
                    const totalRemainingTimeInSeconds = Math.max(0, (5 * 60) - ((currentTime - orderTime) / 1000));

                    // Calculate the remaining minutes and seconds
                    const remainingMinutes = Math.floor(totalRemainingTimeInSeconds / 60);
                    const remainingSeconds = Math.floor(totalRemainingTimeInSeconds % 60);


                    return (
                        <div key={index} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                            <p>Order ID: {order._id}</p>
                            <p>Email: {order.email}</p>
                            <p>Cost: ${order.cost.toFixed(2)}</p>
                            <p>Date Created: {order.date_created}</p>
                            <p>Time Created: {order.time_created}</p>
                            {/* Display the "Edit Order" button if the difference in minutes is less than or equal to 5 */}
                            <p>Menu Items: {order.menuItems.map(id => menuItems[id] || id).join(', ')}</p>
                            <p>Restaurant ID: {order.restaurant_id}</p>
                            <p>Restaurant Name: {order.restaurant_name}</p>
                            <p>Additional Info: {order.additionalInfo}</p>
                            <p>Status: {order.orderStatus}</p>



                            {/** 
<p>Order Time (24-hour format): {time24}</p>
<p>Order Time (Date object): {orderTime.toString()}</p>
<p>Current Time: {currentTime.toString()}</p>

                            <p>Time Remaining: {remainingMinutes} minutes {remainingSeconds} seconds</p>
                             */}
                            <button disabled={totalRemainingTimeInSeconds <= 0}>Edit Order</button>   
                              {totalRemainingTimeInSeconds > 0
                                ? ` Time Remaining: ${remainingMinutes} minutes ${remainingSeconds} seconds`
                                : " Edit Time has elapsed"}
                        </div>
                    );
                })}
            </div>
        </div>

            <div>
                <h3>Order history</h3>
                {orders.filter(order => order.orderStatus === 'Delivered' || order.orderStatus === 'Completed').map((order, index) => (
                    <div key={index} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                        <p>Order ID: {order._id}</p>
                        <p>Email: {order.email}</p>
                        <p>Cost: ${order.cost.toFixed(2)}</p>
                        <p>Date Created: {order.date_created}</p>
                        <p>Menu Items: {order.menuItems.map(id => menuItems[id] || id).join(', ')}</p>
                        <p>Restaurant ID: {order.restaurant_id}</p>
                        <p>Restaurant Name: {order.restaurant_name}</p>
                        <p>Additional Info: {order.additionalInfo}</p>
                        <p>Status: {order.orderStatus}</p>

                        <button>Rate your order!</button>

                    </div>
                ))}
            </div></>




    );
}

export default OrderStatus;