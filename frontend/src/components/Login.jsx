import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Login.css';

// Set axios default configuration
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
            const { success, message, userExists } = data;
            if (success) {
                navigate('/dashboard');
            } else {
                if (!userExists) {
                    setError("User doesn't exist. Please sign up.");
                } else {
                    setError("Incorrect password");
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                let errorMessage = error.response.data.message || error.response.data.error || "An error occurred. Please try again.";
                setError(errorMessage);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="forms-container">
                <div className="signin-signup">
                    <form onSubmit={handleSubmit} className="form-container">
                        <h2 className="title">Sign in</h2>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn solid">Login</button>
                        <p className="social-text">Or Sign in with social platforms</p>
                        <div className="social-media">
                            {/* social media links here */}
                        </div>
                    </form>
                </div>
            </div>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;
