/*
SettingsPage.jsx

This component is used to display the settings page for the admin. It allows the admin to change the delivery fee, service fee, and add or delete universities.
Admin can access change password, delete account, manage drivers, and manage rewards.

A university can be added by entering the name, address, latitude, and longitude. The university can be deleted by clicking the delete button.
- Currently the address must be enetered as latitude and longitude (strings) for the map to work.

Created by: Tyler Costa 19075541

*/

//React imports
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//Header
import UserDashboard from './UserDashboard';
//Styles
import '../style/settingsPage.css';
//Footer
import Footer from '../components/sharedComponents/Footer';

const SettingsPage = () => {
    //Variables
    const [deliveryFee_New, setDeliveryFee_New] = useState(0);
    const [deliveryFee_Current, setDeliveryFee_Current] = useState(0);

    const [serviceFee_New, setServiceFee_New] = useState(0);
    const [serviceFee_Current, setServiceFee_Current] = useState(0);

    const [universityName, setUniversityName] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [universities, setUniversities] = useState([]);

    const addUniversity = async (event) => {
        event.preventDefault();

        // Create a new university object
        const university = {
            name: universityName,
            address,
            coordinates: {
                latitude,
                longitude
            }
        };

        const response = await axios.post('http://localhost:8082/api/universities', university);

        // Add the new university to the universities state variable
        setUniversities([...universities, response.data]);

        // Clear the inputs
        setUniversityName('');
        setAddress('');
        setLatitude('');
        setLongitude('');
    };

    //Fetch the universities
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/universities');
                setUniversities(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUniversities();
    }, []);

    //Fetch the delivery fee
    useEffect(() => {
        const fetchDeliveryFee = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/systemAdmin/getDeliveryFee');
                setDeliveryFee_Current(response.data.fee);
            } catch (error) {
                console.error(error);
            }
        }

        fetchDeliveryFee();
    }, []);

    //Fetch the service fee
    useEffect(() => {
        const fetchServiceFee = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/systemAdmin/getServiceFee');
                setServiceFee_Current(response.data.fee);
            } catch (error) {
                console.error(error);
            }
        }

        fetchServiceFee();
    }, []);

    //Handle the change of the delivery fee
    const handleDeliveryFeeChange = (event) => {
        setDeliveryFee_New(event.target.value);
    }

    //Handle the change of the service fee
    const handleServiceFeeChange = (event) => {
        setServiceFee_New(event.target.value);
    }

    //Update the delivery fee
    const updateDeliveryFee = async () => {
        const confirmation = window.confirm('Are you sure you want to update the delivery fee? from $' + deliveryFee_Current + ' to $' + deliveryFee_New + '?');
        if (confirmation) {
            try {
                await axios.post('http://localhost:8082/api/systemAdmin/updateDeliveryFee', { fee: deliveryFee_New });
                console.log('Delivery fee updated');
            } catch (error) {
                console.error(error);
            }
        }
    }

    //Update the service fee
    const updateServiceFee = async () => {
        const confirmation = window.confirm('Are you sure you want to update the delivery fee? from $' + serviceFee_Current + ' to $' + serviceFee_New + '?');
        if (confirmation) {
            try {
                await axios.post('http://localhost:8082/api/systemAdmin/updateServiceFee', { fee: serviceFee_New });
                console.log('Service fee updated');
            } catch (error) {
                console.error(error);
            }
        }
    }

    //Delete a university
    const deleteUniversity = async (id) => {
        const confirmation = window.confirm('Are you sure you want to delete this university?');

        if (confirmation) {
            await axios.delete(`http://localhost:8082/api/universities/${id}`);

            // Remove the deleted university from the universities state variable
            setUniversities(universities.filter((university) => university._id !== id));
        }
    };

    //Render the settings page
    return (
        <div>
            <UserDashboard />
            <div className='pageContainer'>
                {/* Header */}


                <div className="contentContainer">
                    <h1>Admin Settings</h1>
                    <div className="buttonMenu">
                        {/* Settings buttons */}
                        <Link to="/UpdatePassword">
                            <button>Change Password</button>
                        </Link>
                        <Link to="/DeleteAccount_User">
                            <button>Delete Account</button>
                        </Link>

                        <Link to="/Drivers">
                            <button>Manage Drivers</button>
                        </Link>
                        <Link to="/Rewards">
                            <button>Manage Rewards</button>
                        </Link>
                    </div>

                    <hr></hr>
                    <h2>Universities</h2>
                    <p>Manage My Lunch is available for the following Universities:</p>
                    <div>
                        {/**Existing universities */}
                        {universities.map((university) => (
                            <div className='universityBox'>
                                <div key={university._id}>
                                    <h3>{university.name}</h3>
                                    <p>Address: {university.address}</p>
                                    <p>Latitude: {university.coordinates.latitude}</p>
                                    <p>Longitude: {university.coordinates.longitude}</p>
                                    <br></br>
                                    <button onClick={() => deleteUniversity(university._id)}>Delete University</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr></hr>
                    {/**Add universities */}

                    <div className="addUniversity">
                        <h2>Add a university</h2>

                        <form onSubmit={addUniversity}>
                            <input
                                type="text"
                                placeholder="University Name"
                                value={universityName}
                                onChange={(e) => setUniversityName(e.target.value)}
                            /><br></br>
                            <input
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            /><br></br>
                            <input
                                type="text"
                                placeholder="Latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                            /><br></br>
                            <input
                                type="text"
                                placeholder="Longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                            /><br></br>
                            <br></br>
                            <button type="submit">Add University</button>
                        </form>
                    </div>

                    <hr></hr>
                    <br></br>
                    {/* Delivery and Service Fees can be edited here*/}
                    <h2>Danger Zone</h2>
                    <div className="serviceFeeBox">

                        <label>Delivery Fee: </label>
                        <input type="number" placeholder={deliveryFee_Current} onChange={handleDeliveryFeeChange} />
                        <button onClick={updateDeliveryFee}>Update Delivery Fee</button>
                    </div>
                    <br></br>
                    <div className="serviceFeeBox">
                        <label>Service Fee: </label>
                        <input type="number" placeholder={serviceFee_Current} onChange={handleServiceFeeChange} />
                        <button onClick={updateServiceFee}>Update Service Fee</button>

                    </div>
                </div>
                {/* Footer */}

            </div>
            <Footer />
        </div>
    );
}

export default SettingsPage;