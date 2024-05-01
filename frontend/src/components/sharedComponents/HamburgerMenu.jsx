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
      <button onClick={toggleMenu}>☰</button>
      <nav className={`menu-left ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/path1">Menu Item 1</Link></li>
          <li><Link to="/path2">Menu Item 2</Link></li>
          <li><Link to="/path3">Menu Item 3</Link></li>
          // Add more menu items here...
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;