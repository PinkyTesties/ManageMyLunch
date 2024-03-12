// LoginPage.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send a POST request to the backend API with email and password in request body
      const response = await axios.post("http://localhost:8082/api/login", { email, password });
  
      console.log("Login response:", response.data);
  
      if (response.data.success) {
        // Redirect the user to another page upon successful login
        window.location.href = "/dashboard";
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response && error.response.status === 400) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };
  
  

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
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
        <button type="submit" className="btn btn-primary">
          Login
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
