import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from './componentAssets/logov1.png';

const SignUp = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });

    if (e.target.name === "confirmPassword") {
      setPasswordMatch(e.target.value === user.password);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.password || !user.confirmPassword || !user.university) {
      setError("Please fill in all fields");
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8082/api/users", user);
      setUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        university: "",
      });
      setConfirmation("User signed up successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.status === 409 && error.response.data.message === "User already exists") {
          setError("User already exists with that email");
        } else {
          setError(error.response.data.message);
        }
      } else if (error.request) {
        setError("The request was made but no response was received");
      } else {
        setError("An error occurred while setting up the request");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
            <div>
              <header className="header">
                <div className="header-center">
                <img src={logo} alt='Logo' height={100} />
                <h1>Sign Up to Manage My Lunch</h1>
                </div>
                <div>
                <p>Already have an account?</p > <Link to="/" className="btn btn-link">Login</Link>
                <button>Sign up as driver</button>
                </div>
              </header>
            <main className="main-login">
            <form noValidate onSubmit={onSubmit}>
              <div className="form-group">
              <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  placeholder="name"
                  name="name"
                  className="form-control"
                  value={user.name}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
              <label htmlFor="email">Email:</label>

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={user.name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={user.email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={user.password}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={user.confirmPassword}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="university">University:</label>
          <input
            type="text"
            name="university"
            className="form-control"
            value={user.university}
            onChange={onChange}
          />
        </div>
        {error && <div className="text-danger">{error}</div>}
        {confirmation && <div className="text-success">{confirmation}</div>}
        {!passwordMatch && <div className="text-danger">Passwords do not match</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <div>
          Already have an account? <Link to="/" className="btn btn-link">Login</Link>
        </div>
        <div>
          <button>Sign up as driver</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;