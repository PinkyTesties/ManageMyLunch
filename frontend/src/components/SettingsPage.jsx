import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserDashboard from './UserDashboard';
import '../style/Settings.css'

const SettingsPage = () => {
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [serviceFee, setServiceFee] = useState(0);
    const [universityName, setUniversityName] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [universities, setUniversities] = useState([]);

    const addUniversity = async (event) => {
        event.preventDefault();

        const university = {
            name: universityName,
            address,
            coordinates: {
                latitude,
                longitude
            }
        };

        const response = await axios.post('http://localhost:8082/api/universities', university);

        setUniversities([...universities, response.data]);
        setUniversityName('');
        setAddress('');
        setLatitude('');
        setLongitude('');
    };

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

    useEffect(() => {
        const fetchDeliveryFee = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/systemAdmin/getDeliveryFee');
                setDeliveryFee(response.data.fee);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDeliveryFee();
    }, []);

    useEffect(() => {
        const fetchServiceFee = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/systemAdmin/getServiceFee');
                setServiceFee(response.data.fee);
            } catch (error) {
                console.error(error);
            }
        };

        fetchServiceFee();
    }, []);

    const handleDeliveryFeeChange = (event) => {
        setDeliveryFee(event.target.value);
    };

    const handleServiceFeeChange = (event) => {
        setServiceFee(event.target.value);
    };

    const updateDeliveryFee = async () => {
        try {
            await axios.post('http://localhost:8082/api/systemAdmin/updateDeliveryFee', { fee: deliveryFee });
            console.log('Delivery fee updated');
        } catch (error) {
            console.error(error);
        }
    };

    const updateServiceFee = async () => {
        try {
            await axios.post('http://localhost:8082/api/systemAdmin/updateServiceFee', { fee: serviceFee });
            console.log('Service fee updated');
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUniversity = async (id) => {
        const confirmation = window.confirm('Are you sure you want to delete this university?');
        if (confirmation) {
            await axios.delete(`http://localhost:8082/api/universities/${id}`);
            setUniversities(universities.filter((university) => university._id !== id));
        }
    };

    return (
        <div className="settings-container">
            <UserDashboard />
            <h1 className="settings-header">Settings Page</h1>
            <section className="settings-links">
                <Link to="/UpdatePassword">
                    <button className="settings-button">Change Password</button>
                </Link>
                <Link to="/DeleteAccount_User">
                    <button className="settings-button">Delete Account</button>
                </Link>
                <Link to="/Dashboard">
                    <button className="settings-button">Return to dashboard</button>
                </Link>
                <Link to="/Drivers">
                    <button className="settings-button">Manage Drivers</button>
                </Link>
                <Link to="/Rewards">
                    <button className="settings-button">Manage Rewards</button>
                </Link>
            </section>
            <section className="settings-fees">
                <div>
                    <label>Delivery Fee: $</label>
                    <input type="number" className="settings-fee-input" value={deliveryFee} onChange={handleDeliveryFeeChange} />
                    <button className="settings-fee-button" onClick={updateDeliveryFee}>Update Delivery Fee</button>
                </div>
                <div>
                    <label>Service Fee: $</label>
                    <input type="number" className="settings-fee-input" value={serviceFee} onChange={handleServiceFeeChange} />
                    <button className="settings-fee-button" onClick={updateServiceFee}>Update Service Fee</button>
                </div>
            </section>
            <hr />
            <section className="settings-universities">
                <h2 className="settings-universities-header">Universities</h2>
                <p>Manage My Lunch is available for the following Universities</p>
                {universities.map((university) => (
                    <div key={university._id} className="settings-university">
                        <h3 className="settings-university-name">{university.name}</h3>
                        <p className="settings-university-address">Address: {university.address}</p>
                        <p className="settings-university-latitude">Latitude: {university.coordinates.latitude}</p>
                        <p className="settings-university-longitude">Longitude: {university.coordinates.longitude}</p>
                        <button className="settings-university-delete-button" onClick={() => deleteUniversity(university._id)}>Delete University</button>
                    </div>
                ))}
            </section>
            <hr />
            <section className="settings-add-university">
                <h2 className="settings-add-university-header">Add a university</h2>
                <form className="settings-add-university-form" onSubmit={addUniversity}>
                    <input
                        type="text"
                        className="settings-add-university-input"
                        placeholder="University Name"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                    />
                    <input
                        type="text"
                        className="settings-add-university-input"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        className="settings-add-university-input"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                    <input
                        type="text"
                        className="settings-add-university-input"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                    <button type="submit" className="settings-add-university-submit-button">Add University</button>
                </form>
            </section>
        </div>
    );
};

export default SettingsPage;
