/*
DriverLogin.jsx

This is the login page for the driver. The driver will enter their email and password to login to the system.
This is based on the login page for the user. Created by Vidhu

Created by Tyler Costa 19075541
*/
//React imports
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
//Styles
import '../style/Login.css';


const LoginPage = () => {
    //Variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    //Function to handle the login
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:8082/api/driverslogin", { email, password })
            .then(res => {
                console.log(res);
                navigate('/DriverDashboard');
            })
            .catch(err => {
                console.log(err);
                setError("Invalid email or password");

            });
    }

    //Render the login form, same as vidhus login page for the customer
    return (
        <div className="loginPage">
            <div className="formContainer">
                <div className="loginFormContainer">
                    <form onSubmit={handleSubmit} className="loginForm">
                        <h2 className="formTitle">Driver Sign in</h2>
                        <div className="inputGroup">
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="inputGroup">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="submitButton">Login</button>
                        <p><a href="#" className="forgotPassword">Forgot Password?</a></p>
                    </form>
                </div>
            </div>
            {error && <p>{error}</p>}
        </div>
    );
};

export default LoginPage;
