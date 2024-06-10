
/*
Header component is a shared component that is used in all pages of the application.

Created by Vidhusan

*/
import { Link } from 'react-router-dom';

import '../../style/Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-left-section">
          <h1 class="header-title">Manage <span>My Lunch</span></h1>
        </div>
        <div className="header-right-section">
          <div className="header-auth-buttons">
            <Link to="/login" className="header-login-button">Login</Link>
            <Link to="/sign-up" className="header-signup-button">Sign Up</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
