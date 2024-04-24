
import { Link } from 'react-router-dom';
import logo from './componentAssets/logov1.png';

const SettingsPage = () => {
    return (
        <div>
            <header>
                <img src={logo} alt='Logo' height={100} />
                <h1>Settings Page</h1>
                <p></p>
            </header>
            <hr />
            <div className='MenuButtons'>
                {/* Add your settings components here */}
                <Link to="/UpdatePassword">
                    <button>Change Password</button>
                </Link>
                <Link to="/DeleteAccount_User">
                    <button>Delete Account</button>
                </Link>
                <Link to="/Dashboard">
                    <button>Return to dashboard</button>
                </Link>
                <Link to="/AddDriver">
                    <button>Add a Driver</button>
                </Link>
                </div>
        </div>
    );
}

export default SettingsPage;