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
import Footer from './sharedComponents/Footer';

const SettingsPage = () => {
    //Variables

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [university, setUniversity] = useState("");
    const [userID, setUserID] = useState("");

    // Fetch user details from session
    useEffect(() => {
        axios
            .get("http://localhost:8082")
            .then((res) => {
                if (res.data.valid) {
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setUniversity(res.data.university);
                    setUserID(res.data._id);

                } else {
                    navigate("/");
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const [emailPreferences, setEmailPreferences] = useState({
        emailAfterPurchase: false,
        emailAfterDriverAcceptance: false,
        emailAfterDriverCollection: false,
        emailAfterDriverDelivery: false,
        emailAfterOrderComplete: false,
    });

    useEffect(() => {
        if (!email) {
            return;
        }
    
        fetch(`http://localhost:8082/api/users/email/${email}`)
            .then((response) => response.json())
            .then((data) => {
                setEmailPreferences({
                    emailAfterPurchase: data.emailAfterPurchase,
                    emailAfterDriverAcceptance: data.emailAfterDriverAcceptance,
                    emailAfterDriverCollection: data.emailAfterDriverCollection,
                    emailAfterDriverDelivery: data.emailAfterDriverDelivery,
                    emailAfterOrderComplete: data.emailAfterOrderComplete,
                });
            })
            .catch((err) => console.log(err));
    }, [email]);

    const updateUserEmailPreferences = () => {
        fetch(`http://localhost:8082/api/users/email/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPreferences),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    
    const updateButtonHandler = () => {
        updateUserEmailPreferences();
        alert('Email preferences updated');
    };
    
    //Render the settings page
    return (
        <div>
            <UserDashboard />

            <div className='pageContainer'>
                {/* Header */}

                <div className="contentContainer">


                    <hr></hr>
                    <h2>Change your account settings</h2>
                    <br></br>
                    <div>
                        <h3>Account Information</h3>
                        <p>Name: {name}</p>
                        <p>Email: {email}</p>
                        <p>University: {university}</p>
                    </div>

                    <div className='universityBox'>
                    <h3>Email Preferences</h3>
                    <label>
                        <input type="checkbox" checked={emailPreferences.emailAfterPurchase} onChange={(e) => setEmailPreferences({ ...emailPreferences, emailAfterPurchase: e.target.checked })} />
                        Email after purchase
                    </label>
                    <label>
                        <input type="checkbox" checked={emailPreferences.emailAfterDriverAcceptance} onChange={(e) => setEmailPreferences({ ...emailPreferences, emailAfterDriverAcceptance: e.target.checked })} />
                        Email after driver acceptance
                    </label>
                    <label>
                        <input type="checkbox" checked={emailPreferences.emailAfterDriverCollection} onChange={(e) => setEmailPreferences({ ...emailPreferences, emailAfterDriverCollection: e.target.checked })} />
                        Email after driver collection
                    </label>
                    <label>
                        <input type="checkbox" checked={emailPreferences.emailAfterDriverDelivery} onChange={(e) => setEmailPreferences({ ...emailPreferences, emailAfterDriverDelivery: e.target.checked })} />
                        Email after driver delivery
                    </label>
                    <label>
                        <input type="checkbox" checked={emailPreferences.emailAfterOrderComplete} onChange={(e) => setEmailPreferences({ ...emailPreferences, emailAfterOrderComplete: e.target.checked })} />
                        Email after order complete
                    </label>
                    <button onClick={updateButtonHandler}>Update</button>
                </div>
                    <div className='serviceFeeBox'>
                        <h3>Danger Zone</h3>
                        <Link to="/UpdatePassword">
                            <button>Change Password</button>
                        </Link><br></br>
                        <Link to="/DeleteAccount_User">
                            <button>Delete Account</button>
                        </Link>

                    </div>



                </div>
                {/* Footer */}
            </div>
            <Footer />

        </div>
    );
}

export default SettingsPage;