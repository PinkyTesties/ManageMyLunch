// LoginPage.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios for making HTTP requests

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a GET request to the backend API to check if email and password exist
      const response = await axios.get(`/api/users?email=${email}&password=${password}`);

      console.log("Login response:", response.data);

      if (response.data.length > 0) {
        // Redirect the user to another page upon successful login
        window.location.href = "/dashboard";
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Login</h2>
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
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <Link to="/sign-up" className="btn btn-link">
          Sign Up
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
