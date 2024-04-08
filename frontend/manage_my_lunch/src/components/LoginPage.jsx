import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './componentAssets/logov1.png';
import background from './componentAssets/background.jpg';

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
    <div>
      <header className="header">
        <div className="header-center">
          <img src={logo} alt='Logo' height={100} />
          <h1>Manage My Lunch</h1>
        </div>
        <div>
          <button className='btn-btn'><Link to="/sign-up">Sign Up</Link></button>
          <button className='btn-btn'><Link to={'/DriverLogin'}>Drivers Login</Link></button>
        </div>
      </header>
      <main className='main-login'>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
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
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
      <br></br>
        <Link to="/UpdatePassword" className="btn-btn-link">I forgot my password</Link>
      </form>
      </main>
    </div>
  );
};

export default LoginPage;
