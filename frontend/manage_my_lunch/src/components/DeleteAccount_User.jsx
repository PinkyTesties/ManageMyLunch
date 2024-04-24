import React, { useState } from 'react';
import logo from './componentAssets/logov1.png';

const DeleteAccount_User = () => {
    const [id, setId] = useState('');

    const deleteUser = () => {
        fetch(`http://localhost:8082/api/users/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.msg) {
                    console.log(data.msg);
                } else if (data.error) {
                    console.error(data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <header>
                <img src={logo} alt='Logo' height={100} />
                <h1>Delete Account</h1>
                <p></p>
            </header>
            <div className='delete-user'>
                <form onSubmit={(e) => { e.preventDefault(); deleteUser(); }}>
                <label for={id}> Please enter your username:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
                    <button type="submit">Delete User</button>
                </form>
            </div>

        </div>
    );
}

export default DeleteAccount_User;