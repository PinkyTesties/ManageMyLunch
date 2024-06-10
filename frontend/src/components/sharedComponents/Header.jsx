import { Link } from 'react-router-dom';
import HamburgerMenu from '../sharedComponents/HamburgerMenu';
import '../../style/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="left-section">
          <HamburgerMenu />
          <h1 className="title">Manage My Lunch</h1>
        </div>
        <div className="right-section">
          <div className="search-bar-container">
            <input type="text" className="search-bar" placeholder="Search Menu" />
          </div>
          <div className="auth-buttons">
            <Link to="/login" className="auth-button">Login</Link>
            <Link to="/sign-up" className="auth-button">Sign Up</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;