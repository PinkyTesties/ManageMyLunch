import React from 'react';
import '../../style/Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section about">
        <h1 className="logo-text">About Us</h1>
        <p>
          About ManageMyLunch
        </p>
      </div>

      <div className="footer-section links">
        <h2>Quick Links</h2>
        <br/>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Menu</a></li>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Add your Restaurant</a></li>
          <li><a href="#">Sign Up to Deliver</a></li>
          <li><a href="#">Promotions</a></li>
        </ul>
      </div>

      <div className="footer-section contact-form">
        <h2>Contact us</h2>
        <br/>
        <form>
          <input type="email" name="email" className="text-input contact-input" placeholder="Your email address..."/>
          <textarea rows="4" name="message" className="text-input contact-input" placeholder="Your message..."></textarea>
          <button type="submit" className="btn btn-big contact-btn">
            <i className="fas fa-envelope"></i>
            Send
          </button>
        </form>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© 2024 Manage My Lunch | write something here</p>
    </div>
  </footer>
);

export default Footer;