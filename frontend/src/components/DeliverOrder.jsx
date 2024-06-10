/*
DeliverOrder.jsx
This page handles the delivery of an order from the drivers side. Once the driver has arrived at the delivery location,
they can mark the order as delivered. This will update the order status in the database and add the delivery fee to the drivers wallet.

Created by Xuanhao Wang & Tyler Costa 19075541

*/
// React imports
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import emailjs from 'emailjs-com';
import emailjs from 'emailjs-com';

import axios from 'axios';

const DeliverOrder = () => {
    
    // Variables
    const [map, setMap] = useState(null);
    const [restaurantLat, setRestaurantLat] = useState(null);
    const [restaurantLong, setRestaurantLong] = useState(null);
    const [uniLat, setUniLat] = useState(null);
    const [uniLong, setUniLong] = useState(null);
    const [completedCart, setCompletedCart] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userID, setUserID] = useState("");
    const [walletBalance, setWalletBalance] = useState(0);
    const [selectedOrders, setSelectedOrders] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (window.google && !map) {
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                const initialMap = new window.google.maps.Map(mapContainer, {
                    zoom: 15,
                    center: { lat: -36.8485, lng: 174.7633 } // Auckland CBD
                });
                setMap(initialMap);
            }
        }
    }, [map]);

    const loadGoogleMaps = () => {
        const existingScript = document.querySelector('script[src*="googleapis"]');
        if (!existingScript) {
            window.initMap = () => {
                const mapContainer = document.getElementById('map');
                if (mapContainer && !map) {
                    if (window.google) {
                        const initialMap = new window.google.maps.Map(mapContainer, {
                            zoom: 15,
                            center: { lat: -36.8485, lng: 174.7633 } // Auckland CBD
                        });
                        setMap(initialMap);
                    }
                }
            };
    
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCitl6yX_uVB95MJzBdlACmT5sy5j0vcZc&callback=initMap';
            script.async = true;
            script.defer = true;
            script.addEventListener('load', window.initMap);
            document.body.appendChild(script);
        }
    };
    
    // Load Google Maps API on component mount
    useEffect(() => {
        loadGoogleMaps();
    }, []);
    
    // Plan the route from the restaurant to the university
    const planRoute = () => {

        // Function to parse coordinates
        const parseCoordinates = (coord) => {
            if (coord.includes(',')) {
                const [lat, lng] = coord.split(',').map(Number);
                return { lat, lng };
            }
            return coord.trim();
        };
    
        // Get the origin and destination coordinates from restaurant object and university object
        const origin = parseCoordinates(restaurantLat + ',' + restaurantLong);
        const destination = parseCoordinates(uniLat + ',' + uniLong);
    
        // Log the origin and destination
        console.log('Planning route from:', origin, 'to', destination);
    
        // Send the origin and destination to the backend
        axios.post('http://localhost:8082/api/route', { origin, destination })
            .then(response => {
                console.log('Received route data:', response.data);
    
                const directionsService = new window.google.maps.DirectionsService();
                directionsService.route({
                    origin,
                    destination,
                    travelMode: 'DRIVING'
                }, (result, status) => {
                    if (status === 'OK') {
                        const directionsDisplay = new window.google.maps.DirectionsRenderer();
                        directionsDisplay.setMap(map);
                        directionsDisplay.setDirections(result);
                    } else {
                        console.error('Directions request failed due to ' + status);
                    }
                });
            })
            .catch(error => {
                console.error('Error planning route:', error);
            });
    };

    // Get the drivers name and email from the session
    useEffect(() => {
        axios
            .get("http://localhost:8082")
            .then((res) => {
                console.log(res.data); 
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

    //
    useEffect(() => {
        const fetchCompletedCart = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/api/completedCarts/id/${id}`);
                setCompletedCart(response.data);
            } catch (error) {
                console.error('Error fetching completed cart:', error);
            }
        };

        fetchCompletedCart();
    }, [id]);

    // Handle the delivery of the order
    const handleDelivered = (orderId, email) => {
        if (!window.confirm('Are you sure you are ready to deliver this order?')) {
            // If the user clicked "Cancel", don't execute the rest of the function
            return;
        }
        let deliveryFee = 0;

        axios.put(`http://localhost:8082/api/completedCarts/status/${orderId}`, { orderStatus: 'Delivered' })
            .then(response => {
                // After updating the order status, fetch the order to get the delivery fee
                return axios.get(`http://localhost:8082/api/completedCarts/id/${orderId}`);
            })
            .then(response => {
                if (response.data) {
                    // Fetch and assign delivery fee so that amount can be applied to driver wallet
                    deliveryFee = response.data.delivery_fee; 
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
                    // Update the local walletBalance variable
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

            //Send Email
            sendEmail();
            //Navigate to the driver dashboard
        navigate('/DriverDashboard');

    };

    // Fetch the restaurants latitude and longitude from the database
    useEffect(() => {
        if (completedCart) {
            const restaurant_id = completedCart.restaurant_id;

            // Fetch the restaurant data from the database using the restaurant_id
            fetch(`http://localhost:8082/api/restaurants/${restaurant_id}`)
                .then(response => response.json())
                .then(data => {
                    // If data is an array, use the first object in the array
                    const restaurantData = Array.isArray(data) ? data[0] : data;

                    setRestaurantLat(parseFloat(restaurantData.latitude));
                    setRestaurantLong(parseFloat(restaurantData.longitude));
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [completedCart]);

    // Fetch the universities latitude and longitude from the database
    useEffect(() => {
        if (completedCart) {
            //Assign the delivery location to a variable
            const delivery_location = completedCart.delivery_location;
            fetch(`http://localhost:8082/api/universities/name/${delivery_location}`)
                .then(response => response.json())
                .then(data => {
                    //assign the latitude and longitude to the variables
                    setUniLat(parseFloat(data.coordinates.latitude));
                    setUniLong(parseFloat(data.coordinates.longitude));
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [completedCart]);
    
    // Send an email to the customer
    const sendEmail = async () => {
        // Fetch user's email preference
        const fetchUserEmailPreference = async (email) => {
          const response = await fetch(`http://localhost:8082/api/users/email/${email}`);
          const data = await response.json();
          return data.emailAfterDriverDelivery;
        };
      
        const emailAfterDriverDelivery = await fetchUserEmailPreference(completedCart.email);
      
        // If user does not want to receive emails, return
        if (!emailAfterDriverDelivery) {
          return;
        }
      
        // Email content
        const emailParams = {
          email_from: completedCart.email,
          message: 
          "Hey there "+ completedCart.customerName + ", "+
          "Your order from " + completedCart.restaurant_name +" has been delivered to, " + completedCart.delivery_location + "!\n\n" +
          "Once youve collected your order, log in to Manage My Lunch to confirm youve picked up your order. \n\n" +
          "Confirm you've collected your order by scanning the QR code with your order, or using this unique code: " + completedCart.code+". \n\n" +
          "Log in to Manage My Lunch here: http://localhost:5173/CompleteOrder at any time to confirm your order pickup. \n\n"
        };
      
        // Emailjs api details
        emailjs.send('service_gmcskkn', 'template_v78bl21', emailParams, 'XfgsvummwbkF3G1dV')
          .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
          }, (err) => {
            console.log('FAILED...', err);
          });
      };

      // Render the content to the page
    return (
        <div>
            {/**For simplicity I put some styles here in the div, it overides the css file */}
            <div
            
                id="controls"
                style={{
                    padding: '20px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                }}
            >
                <div>
                    <h1>Order Details</h1>
                    {/* Display the completed cart details here */}
                    {completedCart ? (
                        <>
                            <p>OrderId: {completedCart._id}</p>
                            Delivering from {completedCart.restaurant_name} to {completedCart.delivery_location}
                            <p>Customer Name: {completedCart.customerName}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                {/**When clicked the route planning starts */}
                <button
                    onClick={planRoute}
                    style={{
                        width: '10%',
                        padding: '10px',
                        backgroundColor: '#34a853',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        margin: '5px 0',
                        cursor: 'pointer',
                    }}
                >
                    Go
                </button>

            </div>
            <br></br>
            {/** Display the map */}
            <div
                id="map-container"
                style={{ width: '80%', height: '500px', margin: '20px auto' }}
            >
                <div id="map" style={{ width: '100%', height: '100%' }}></div>
            </div>
            {/**Deliver the order on arrival */}
            <button
                onClick={() => handleDelivered(completedCart._id, email)}
                style={{
                    width: '10%',
                    padding: '10px',
                    backgroundColor: '##1A73E8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    margin: '5px 0',
                    cursor: 'pointer',
                    marginLeft: '45%',
                }}
            >
                Ive Arrived
            </button>
        </div>
    );
};


export default DeliverOrder;



