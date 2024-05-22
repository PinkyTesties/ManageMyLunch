import React, { useState, useEffect } from 'react';
import UserDashboard from './UserDashboard'; // Import UserDashboard
import '../style/UpdatePassword.css'; // Import the CSS file

function UpdatePassword() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8082/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handlePasswordUpdate = (event) => {
    event.preventDefault();

    const user = users.find(user => user.email === username || user.name === username);

    if (user) {
      if (user.password === newPassword) {
        setErrorMessage("Can't use the old password");
        return;
      }

      fetch(`http://localhost:8082/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      })
      .then(response => response.json())
      .then(data => {
        setUsers(users.map(user => user._id === data._id ? data : user));
        setUsername('');
        setNewPassword('');
        setSuccessMessage('Password updated successfully');
        setErrorMessage('');
      })
      .catch(error => {
        console.error('Error updating password:', error);
        setSuccessMessage('');
        setErrorMessage('Error updating password');
      });
    } else {
      setErrorMessage('Incorrect email or username');
    }
  };

  return (
    <div className="update-password-container">
      <UserDashboard /> {/* Use UserDashboard */}

      <h1 className="update-password-header">Reset your password</h1>
      {successMessage && <p className="update-password-message update-password-success">{successMessage}</p>}
      {errorMessage && <p className="update-password-message update-password-error">{errorMessage}</p>}
      <form className="update-password-form" onSubmit={handlePasswordUpdate}>
        <input
          type="text"
          className="update-password-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username or Email"
          required
        />
        <input
          type="password"
          className="update-password-input"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <button type="submit" className="update-password-button">Update Password</button>
      </form>
      <p>***Below is for testing purposes, remove from final version***</p>
      <ul className="update-password-testing">
        {users.map(user => (
          <li key={user._id}>
            User ID: {user._id} <br />
            Username: {user.name}<br />
            Email: {user.email}<br />
            Password: {user.password}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UpdatePassword;

