import { Link } from 'react-router-dom';
import logo from '../componentAssets/logov1.png';
import HamburgerMenu from '../sharedComponents/HamburgerMenu'; 
import '../../style/Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <HamburgerMenu /> {/* Include HamburgerMenu */}
      <div className="header-content">
        <img src={logo} alt='Logo' className="logo" />
        <h1 className="title">Manage My Lunch</h1>
      </div>
      <div className="auth-buttons">
        <button className='login'><Link to="/Login">Login</Link></button>
        <button className='signup'><Link to={'/sign-up'}>SignUp</Link></button>
      </div>
    </header>
  );
};

export default Header;