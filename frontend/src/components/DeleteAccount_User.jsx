import React, { useState } from 'react';
import '../style/DeleteAccount.css';

const DeleteAccount_User = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const deleteUser = () => {
        if (email.trim() === '' || password.trim() === '') {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        fetch(`http://localhost:8082/api/users/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            console.log('Server response:', response);  // Log the server response
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                if (data.error === 'No such user or incorrect password') {
                    setErrorMessage('Incorrect email or password. Please try again.');
                } else {
                    setErrorMessage('An error occurred. Please try again later.');
                }
                console.error(data.error);
            } else if (data.msg) {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    alert('Account deleted successfully.'); 
                    console.log(data.msg);
                    // Log out the user and redirect to main page
                    localStorage.removeItem('jwtToken');
                    window.location.href = '/';  
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        });
    };

    return (
        <div className="delete-account-container">
            <h1 className="delete-account-header">Delete Account</h1>
            <form className="delete-account-form" onSubmit={(e) => { e.preventDefault(); deleteUser(); }}>
                <input className="delete-account-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                <input className="delete-account-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                <button className="delete-account-button" type="submit">Delete User</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default DeleteAccount_User;