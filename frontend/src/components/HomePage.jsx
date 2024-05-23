import React from 'react';
import Header from "./sharedComponents/Header";
import Footer from './sharedComponents/Footer';
import '../style/HomePage.css';

const HomePage = () => {
  return (
    <div className="page-container">
      <Header />
      <div className="content-wrap">
        <div className="home-page">
          <div className="hero-section">
            <h1>Welcome to Our Restaurant App</h1>
            <p>Order your favorite meals with ease.</p>
          </div>
          <div className="content">
            <div className="info-box">
              <h2>About Us</h2>
              <p>Who we are and what we do...</p>
              <button className="cta-button">Learn More</button>
            </div>
            <div className="info-box">
              <h2>Become a Driver</h2>
              <p>Information about becoming a driver...</p>
              <button className="cta-button">Sign Up</button>
            </div>
            <div className="info-box">
              <h2>Food Providers</h2>
              <p>Information for food providers...</p>
              <button className="cta-button">Join Us</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;

