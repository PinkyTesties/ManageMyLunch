import { Link } from 'react-router-dom';
import HamburgerMenu from '../sharedComponents/HamburgerMenu'; 
import '../../style/Header.css'; 

const Header = () => {
  const buttonStyle = {
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '25px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

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
            <Link to="/login" style={buttonStyle}>Login</Link>
            <Link to="/sign-up" style={buttonStyle}>Sign Up</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

