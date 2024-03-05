// LoginPage.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add login logic, such as sending a request to your backend
    // to authenticate the user with the provided email and password
    console.log("Logging in with:", email, password);
    // After successful login, you can redirect the user to another page
    // For now, redirecting to ShowBookList.jsx
    window.location.href = "/show-book-list"; // Assuming route to ShowBookList.jsx is "/show-book-list"
  };

  return (
    <div className="container mt-5">
        <p>***THIS PAGE STILL REQUIRES CSS. DO NOT SUBMIT AS IS***</p>

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
        <Link to="/sign-up" className="btn btn-link">Sign Up</Link>
      </form>
    </div>
  );
};

export default LoginPage;
