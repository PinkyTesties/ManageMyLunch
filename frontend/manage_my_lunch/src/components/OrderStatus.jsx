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
    if (orders.length > 0) {
        const now = new Date();
        const nowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        const newCountdowns = orders.reduce((acc, order) => {
            const orderTime = new Date(order.time_created);
            const orderTimeUtc = Date.UTC(orderTime.getUTCFullYear(), orderTime.getUTCMonth(), orderTime.getUTCDate(), orderTime.getUTCHours(), orderTime.getUTCMinutes(), orderTime.getUTCSeconds());
            const diffInMilliseconds = nowUtc - orderTimeUtc;
            const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
            acc[order._id] = diffInMinutes < 5 ? 5 - diffInMinutes : 0;
            return acc;
        }, {});

        setCountdowns(newCountdowns);

        const countdownInterval = setInterval(() => {
            setCountdowns(prevCountdowns => {
                const updatedCountdowns = { ...prevCountdowns };
                for (let id in updatedCountdowns) {
                    if (updatedCountdowns[id] > 0) {
                        updatedCountdowns[id]--;
                    }
                }
                return updatedCountdowns;
            });
        }, 1000); // decrease every second

        return () => clearInterval(countdownInterval);
    }
}, [orders]);


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
        <div>
            <img src={logo} alt='Logo' height={100} />
            <h1>Manage My Lunch Dashboard</h1>
            <p>***** CSS NOT DONE. DO NOT SUBMIT *****</p>

            <button onClick={toggleDropdown}>Account</button>
            <Link to="/Cart" className='header-button-right'>Cart</Link>
            <button className='header-button-right'><Link to={'/'} style={{ textDecoration: 'none', color: 'Black' }}>Logout</Link></button>
            <p>Logged in as: {name}, {university}, {email}, {userID}</p>
            <Modal
                isOpen={showDropdown}
                onRequestClose={toggleDropdown}
                contentLabel="Account Menu"
                style={customStyles}

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
                {orders.filter(order => order.orderStatus === 'Pending').map((order, index) => (
                    <div key={index} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                        <p>Order ID: {order._id}</p>
                        <p>Email: {order.email}</p>
                        <p>Cost: ${order.cost.toFixed(2)}</p>
                        <p>Date Created: {order.date_created}</p>
                        <p>Time Created: {order.time_created}</p>
                        <p>Time Remaining: {countdowns[order._id]} minutes</p>
                        {countdowns[order._id] > 0 && <button>Edit Order</button>}
                        <p>Menu Items: {order.menuItems.map(id => menuItems[id] || id).join(', ')}</p>
                        <p>Restaurant ID: {order.restaurant_id}</p>
                        <p>Restaurant Name: {order.restaurant_name}</p>
                        <p>Additional Info: {order.additionalInfo}</p>
                        <p>Order Status: {order.orderStatus}</p>

                    </div>
                ))}
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
                        <button>Rate your order!</button>

                    </div>
                ))}
            </div>


        </div>


    );
}

export default OrderStatus;