import React from 'react';
import '../../style/Footer.css';

const Footer = () => {
  const LinksSection = () => (
    <div className="footer-links">
      <h2 className="footer-title">Quick Links</h2>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="dashboard">Dashboard</a></li>
        <li><a href="cart">Cart</a></li>
        <li><a href="#">Sign Up to Deliver</a></li>
      </ul>
    </div>
  );

  const ContactForm = () => (
    <div className="footer-contact">
      <h2 className="footer-title">Contact us</h2>
      <form>
        <input type="email" name="email" className="input-email" placeholder="Your email address..." />
        <textarea rows="4" name="message" className="input-message" placeholder="Your message..."></textarea>
        <button type="submit" className="btn-send">
          <i className="fas fa-envelope"></i>
          Send
        </button>
      </form>
    </div>
  );

  return (
    <footer className="footer">
      <div className="footer-content">
        <LinksSection />
        <ContactForm />
      </div>
      <div className="footer-bottom">
        <p>© 2024 Manage My Lunch </p>
      </div>
    </footer>
  );
};

export default Footer;
