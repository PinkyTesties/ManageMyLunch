

// function DeliverOrder() {
//   const { id } = useParams();
//   const [completedCart, setCompletedCart] = useState(null);

//   useEffect(() => {
//     const fetchCompletedCart = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8082/api/completedCarts/id/${id}`);
//         setCompletedCart(response.data);
//       } catch (error) {
//         console.error('Error fetching completed cart:', error);
//       }
//     };

//     fetchCompletedCart();
//   }, [id]);

//   if (!completedCart) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>

//     </div>
//   );
// }

// export default DeliverOrder;import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';

const DeliverOrder = () => {
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [map, setMap] = useState(null);
    const [restaurantLat, setRestaurantLat] = useState(null);
    const [restaurantLong, setRestaurantLong] = useState(null);
    const [uniLat, setUniLat] = useState(null);
    const [uniLong, setUniLong] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [university, setUniversity] = useState("");
    const [userID, setUserID] = useState("");
    const [walletBalance, setWalletBalance] = useState(0);
    const [selectedOrders, setSelectedOrders] = useState([]);

    const navigate = useNavigate();

    const { id } = useParams();



    useEffect(() => {
        loadGoogleMaps();
    }, []);

    const loadGoogleMaps = () => {
        const existingScript = document.querySelector('script[src*="googleapis"]');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCitl6yX_uVB95MJzBdlACmT5sy5j0vcZc&callback=initMap';
            script.async = true;
    
            window.initMap = () => {
                const mapContainer = document.getElementById('map');
                if (mapContainer && !map) {
                  if (window.google) {
                    const initialMap = new window.google.maps.Map(mapContainer, {
                      zoom: 15,
                      center: { lat: -36.8485, lng: 174.7633 } // Auckland CBD
                    });
                    setMap(initialMap);
                  } else {
                    // If window.google is not defined, delay map creation
                    setTimeout(window.initMap, 100);
                  }
                }
              };
    
            script.onload = () => {
                if (window.initMap) initMap();
            };
    
            script.onerror = () => {
                console.error('Google Maps script failed to load.');
            };
    
            document.body.appendChild(script);
        } else {
            if (window.initMap) initMap();
        }
    };

    // useEffect(() => {
    //     window.initMap = () => {
    //         const mapContainer = document.getElementById('map');
    //         if (mapContainer && !map) {
    //             const initialMap = new window.google.maps.Map(mapContainer, {
    //                 zoom: 15,
    //                 center: { lat: -36.8485, lng: 174.7633 } // Auckland CBD
    //             });
    //             setMap(initialMap);
    //         }
    //     };

    //     // Call the function
    //     window.initMap();

    // }, [map]); // Add other dependencies if needed
    // useEffect(() => {
    //     window.initMap = () => {
    //       const mapContainer = document.getElementById('map');
    //       if (mapContainer && !map) {
    //         const initialMap = new window.google.maps.Map(mapContainer, {
    //           zoom: 15,
    //           center: { lat: -36.8485, lng: 174.7633 } // Auckland CBD
    //         });
    //         setMap(initialMap);
    //       }
    //     };
    //   }, [map]); // Add other dependencies if needed

    const planRoute = () => {

        const parseCoordinates = (coord) => {
            if (coord.includes(',')) {
                const [lat, lng] = coord.split(',').map(Number);
                return { lat, lng };
            }
            return coord.trim();
        };

        const origin = parseCoordinates(restaurantLat + ',' + restaurantLong);
        const destination = parseCoordinates(uniLat + ',' + uniLong);

        console.log('Planning route from:', origin, 'to', destination); // Debugging line

        axios.post('http://localhost:8082/api/route', { origin, destination })
            .then(response => {
                console.log('Received route data:', response.data); // Debugging line

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
                CBD
            });
    };

    const locateCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setStartPoint(`${latitude}, ${longitude}`);
            console.log('Current location:', `${latitude}, ${longitude}`); // Debugging line
        }, error => {
            console.error("Error Accessing Location: ", error);
        });
    };

    const [completedCart, setCompletedCart] = useState(null);
    const completeRoute = () => {

        navigate('/DriverDashboard');
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

    // Assuming you're in a functional component
    const handleDelivered = (orderId, email) => {
        if (!window.confirm('Are you sure you are ready to deliver this order?')) {
            // If the user clicked "Cancel", don't execute the rest of the function
            return;
        }
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
        navigate('/DriverDashboard');

    };
    useEffect(() => {
        if (completedCart) {
            const restaurant_id = completedCart.restaurant_id;

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

    useEffect(() => {
        // Replace 'UniversityName' with the name of the university
        if (completedCart) {

            const delivery_location = completedCart.delivery_location;
            fetch(`http://localhost:8082/api/universities/name/${delivery_location}`)
                .then(response => response.json())
                .then(data => {
                    setUniLat(parseFloat(data.coordinates.latitude));
                    setUniLong(parseFloat(data.coordinates.longitude));
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [completedCart]);
    // if (!completedCart) {
    //     return <div>Loading...</div>;
    // }




    return (
        <div>
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
                {/**
                                    <button onClick={locateCurrentPosition} style={{ width: '90%', padding: '10px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: '5px', margin: '5px 0', cursor: 'pointer' }}>Locate Me</button>
                             */}
            </div>
            <br></br>
            <div
                id="map-container"
                style={{ width: '80%', height: '500px', margin: '20px auto' }}
            >
                <div id="map" style={{ width: '100%', height: '100%' }}></div>
            </div>
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
                    marginLeft: '45%', // Center the button
                }}
            >
                Ive Arrived
            </button>
        </div>
    );
};


export default DeliverOrder;



