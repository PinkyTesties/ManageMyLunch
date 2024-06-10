import React, { useState, useEffect } from 'react';
import logo from './componentAssets/logov1.png';

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
        setErrorMessage("Can't use the old password"); // Display error message if the new password is the same as the old password
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
      setErrorMessage('Incorrect email or username'); // Display error message if the user is not found
    }
  };

  return (
    <div>
      <header>
      <img src={logo} alt='Logo' height={100} />
      <h1>Reset your password</h1>
<<<<<<< HEAD:frontend/manage_my_lunch/src/components/UpdatePassword.jsx
      <p></p>
      </header>
      <div className='delete-user'>
=======
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>} {/* Display error message if there is any */}
>>>>>>> b944fe787571675b27498ea2457756757baa57af:frontend/src/components/UpdatePassword.jsx
      <form onSubmit={handlePasswordUpdate}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username or Email"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <button type="submit">Update Password</button>
      </form>
      <p>***Below is for testing purposes, remove from final version***</p>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            User ID: {user._id} <br></br>
            Username: {user.name}<br></br>
            Email: {user.email}<br></br>
            Password: {user.password}
          </li>
        ))}
      </ul>
      </div>
      
    </div>
  );
}

export default UpdatePassword;
