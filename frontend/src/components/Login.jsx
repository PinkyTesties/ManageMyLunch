import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

axios.defaults.withCredentials = true;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const { data } = await axios.post('http://localhost:8082/api/login', { email, password });
            const { success, userExists } = data;
            if (success) {
                navigate('/dashboard');
            } else {
                setError(userExists ? "Incorrect password" : "User doesn't exist. Please sign up.");
            }
        } catch (error) {
            setError(error.response && error.response.data ? error.response.data.message || error.response.data.error : "An error occurred. Please try again.");
        }
    };

    return (
        <div className="loginPage">
            <div className="formContainer">
                <div className="loginFormContainer">
                    <form onSubmit={handleSubmit} className="loginForm">
                        <h2 className="formTitle">Sign in</h2>
                        <div className="inputGroup">
                            <input
                                type="email"
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

export default Login;
