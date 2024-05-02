import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../style/HamburgerMenu.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Close the menu when clicking anywhere on the website
  useEffect(() => {
    const closeMenu = () => {
      setIsOpen(false);
    };

    document.addEventListener('click', closeMenu);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, []);

  return (
    <div>
      <button onClick={toggleMenu} aria-label="Toggle Navigation Menu">☰</button>
      <nav className={`menu-left ${isOpen ? 'open' : ''}`}>
        <div className="auth-buttons">
          <button className='login primary'><Link to="/Login">Login</Link></button>
          <button className='signup secondary'><Link to={'/sign-up'}>SignUp</Link></button>
        </div>
        <ul>
          <li><Link to="/path1">Create Bussiness Account</Link></li>
          <li><Link to="/path2">Create Driver Account</Link></li>
          <li><Link to="/path3">About</Link></li>
          <li><Link to="/path4">Contact Us</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;
