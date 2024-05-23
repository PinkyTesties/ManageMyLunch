import React from 'react';
import Header from "./sharedComponents/Header";
import Footer from './sharedComponents/Footer';
import '../style/HomePage.css';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />
      <div className="content-wrap">
        <div className="home-page">
          <div className="hero-section">
            <h1>Welcome to Manage My Lunch</h1>
            <p>Order your favorite meals with ease.</p>
          </div>
          <div className="content">
            <div className="info-box">
              <h2>Sign Up</h2>
              <p>Sign up to Manage My Lunch</p>
              <button onClick={() => navigate('/sign-up')} className="cta-button">Sign Up</button>
            </div>
            <div className="info-box">
              <h2>Become a Driver</h2>
              <p>Information about becoming a driver...</p>
              <button onClick={() => navigate('/sign-up-driver')}className="cta-button">Sign Up to Drive</button>
            </div>
            <div className="info-box">
              <h2>Driver Login</h2>
              <p>Login as a driver</p>
              <button onClick={() => navigate('/DriverLogin')}className="cta-button">Login</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;

