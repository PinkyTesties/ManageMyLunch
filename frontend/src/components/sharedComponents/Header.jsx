import { Link } from 'react-router-dom';
// Import HamburgerMenu removed

import '../../style/Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-left-section">
          {/* HamburgerMenu removed */}
          <h1 class="header-title">Manage <span>My Lunch</span></h1>
          {/* Search bar removed */}
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
