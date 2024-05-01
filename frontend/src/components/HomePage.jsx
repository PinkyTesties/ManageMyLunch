import { Link } from 'react-router-dom';
import logo from './componentAssets/logov1.png';
import HamburgerMenu from './sharedComponents/HamburgerMenu'; 

const HomePage = () => {
  return (
    <div>
      <header className="header">
        <div className="header-center">
          <HamburgerMenu /> {/* Include HamburgerMenu */}
          <img src={logo} alt='Logo' height={100} />
          <h1>Manage My Lunch</h1>
        </div>
        <div>
          <button className='login'><Link to="/Login">Login</Link></button>
          <button className='signup'><Link to={'/sign-up'}>SignUp</Link></button>
        </div>
      </header>
    </div>
  );
};

export default HomePage;