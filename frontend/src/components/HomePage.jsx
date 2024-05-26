/* 
HomePage.jsx
This file is used to display the home page of the website. The user can sign up, login as a customer or login as a driver from this page.
The page is automatically displayed when the user navigates to the website. Or attempts to access another page while they are not logged in

Created by Vidhusan S

*/

//React imports
import React from 'react';
import { useNavigate } from 'react-router-dom';
//Header
import Header from "./sharedComponents/Header";
//Footer
import Footer from './sharedComponents/Footer';
//Styles
import '../style/HomePage.css';


const HomePage = () => {
  //Variables
  const navigate = useNavigate();

  //Render the home page content
  return (
    <div className="page-container">
      {/* Header */}
      <Header />
      <div className="content-wrap">
        <div className="home-page">
          <div className="hero-section">
            <h1>Welcome to Manage My Lunch</h1>
            <p>Order your favorite meals with ease.</p>
          </div>
          <div className="content">
            <div className="info-box">
              {/* Sign up*/}
              <h2>Sign Up</h2>
              <p>Sign up to Manage My Lunch</p>
              <button onClick={() => navigate('/sign-up')} className="cta-button">Sign Up</button>
            </div>
            <div className="info-box">
              <h2>Login</h2>
              <p>Login as a customer here</p>
              <button onClick={() => navigate('/login')}className="cta-button">Sign Up to Drive</button>
            </div>
            <div className="info-box">
              <h2>Driver Login</h2>
              <p>Login as a driver</p>
              <button onClick={() => navigate('/DriverLogin')}className="cta-button">Login</button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

