import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './componentAssets/logov1.png';

// Set axios default configuration
axios.defaults.withCredentials = true;

// LoginPage component
const LoginPage = () => {
  // Define state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // Function to handle errors
  const handleError = (err) => {
    setErrorMessage(err);
  };

  // Function to handle successful login
  const handleSuccess = (msg) => {
    navigate('/dashboard');
  };

  // Function to validate email format
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form inputs
    if (!email || !password) {
      handleError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      handleError("Invalid email");
      return;
    }

    setLoading(true);

    try {
      // Send login request
      const { data } = await axios.post("http://localhost:8082/api/login", { email, password });
      const { success, message, userExists } = data;
      if (success) {
        handleSuccess(message);
      } else {
        if (!userExists) {
          handleError("User doesn't exist. Please sign up.");
        } else {
          handleError("Incorrect password");
        }
      }
    } catch (error) {
      // Handle request error
      if (error.response && error.response.data) {
        let errorMessage = error.response.data.message || error.response.data.error || "An error occurred. Please try again.";
        handleError(errorMessage);
      } else {
        handleError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Render LoginPage component
  return (
    <div className="container mt-5">
      <img src={logo} alt='Logo' height={100} />

      <h2>Login</h2>
      <p>***THIS PAGE STILL REQUIRES CSS. DO NOT SUBMIT AS IS***</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          {errorMessage && (
            <span className="text-danger">{errorMessage}</span>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
        <Link to="/sign-up" className="btn btn-link">
          Sign Up
        </Link>
        <br></br>
        <Link to="/UpdatePassword" className="btn btn-link">
          I forgot my password
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
