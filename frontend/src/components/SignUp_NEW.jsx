import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from './componentAssets/logov1.png';
import '../style/SignUp.css';

const SignUp_NEW = () => {
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
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/universities');
        setUniversities(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUniversities();
  }, []);

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
    <div className="signup-container">
      <header className="signup-header">
        <div className="signup-header-center">
          <img src={logo} alt='Logo' height={100} />
          <h1>Sign Up to Manage My Lunch</h1>
        </div>
      </header>
      <main className="signup-main">
        <form className="signup-form" onSubmit={onSubmit}>
          <div className="signup-form-group">
            <input
              type="text"
              name="name"
              className="signup-input-field"
              placeholder="Name"
              value={user.name}
              onChange={onChange}
            />
          </div>
          <div className="signup-form-group">
            <input
              type="email"
              name="email"
              className="signup-input-field"
              placeholder="Email"
              value={user.email}
              onChange={onChange}
            />
          </div>
          <div className="signup-form-group">
            <input
              type="password"
              name="password"
              className="signup-input-field"
              placeholder="Password"
              value={user.password}
              onChange={onChange}
            />
          </div>
          <div className="signup-form-group">
            <input
              type="password"
              name="confirmPassword"
              className="signup-input-field"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={onChange}
            />
          </div>
          <div className="signup-form-group">
            <select name="university" value={user.university} onChange={onChange} className="signup-input-field"
            >
              <option value="">Select a university</option>
              {universities.map((university) => (
                <option key={university._id} value={university.name}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="signup-error">{error}</div>}
          {confirmation && <div className="signup-success">{confirmation}</div>}
          {!passwordMatch && <div className="signup-error">Passwords do not match</div>}
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </main>
      <footer className="signup-footer">
        <p>Already have an account? <Link to="/login" className="signup-btn-link">Login</Link></p>
        <button className="signup-btn">Sign up as driver</button>
      </footer>
    </div>
  );
};

export default SignUp_NEW;