
import { Link } from 'react-router-dom';

const SettingsPage = () => {
    return (
        <div>
            <h1>Settings Page</h1>
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
    );
}

export default SettingsPage;