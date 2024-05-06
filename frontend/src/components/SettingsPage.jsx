//Settings page
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Assuming you're using axios for HTTP requests


const SettingsPage = () => {

    const [deliveryFee, setDeliveryFee] = useState(0);
    const [serviceFee, setServiceFee] = useState(0);


    useEffect(() => {
        const fetchDeliveryFee = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/systemAdmin/getDeliveryFee');
                setDeliveryFee(response.data.fee);
            } catch (error) {
                console.error(error);
            }
        }

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
        }

        fetchServiceFee();
    }, []);


    const handleDeliveryFeeChange = (event) => {
        setDeliveryFee(event.target.value);
    }

    const handleServiceFeeChange = (event) => {
        setServiceFee(event.target.value);
    }


    const updateDeliveryFee = async () => {
        try {
            await axios.post('http://localhost:8082/api/systemAdmin/updateDeliveryFee', { fee: deliveryFee });
            console.log('Delivery fee updated');
        } catch (error) {
            console.error(error);
        }
    }

    const updateServiceFee = async () => {
        try {
            await axios.post('http://localhost:8082/api/systemAdmin/updateServiceFee', { fee: serviceFee });
            console.log('Service fee updated');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Settings Page</h1>
            {/* Add your settings components here */}
            <Link to="/UpdatePassword">
                <button>Change Password</button>
            </Link>
            <Link to="/DeleteAccount_User">
                <button>Delete Account</button>
            </Link>
            <Link to="/Dashboard">
                <button>Return to dashboard</button>
            </Link>
            <Link to="/AddDriver">
                <button>Add a Driver</button>
            </Link>
            <div>
                <br></br>
                <label>Delivery Fee: $</label>
                <input type="number" placeholder={deliveryFee} onChange={handleDeliveryFeeChange} />
                <button onClick={updateDeliveryFee}>Update Delivery Fee</button>
            </div>
            <br></br>
            <div>
            <label>Service Fee: $</label>
                <input type="number" placeholder={serviceFee} onChange={handleServiceFeeChange} />
                <button onClick={updateServiceFee}>Update Service Fee</button>

            </div>
        </div>
    );
}

export default SettingsPage;