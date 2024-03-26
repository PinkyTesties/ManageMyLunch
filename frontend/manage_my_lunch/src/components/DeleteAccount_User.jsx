import React, { useState } from 'react';

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
            <h1>Delete Account</h1>
            <form onSubmit={(e) => { e.preventDefault(); deleteUser(); }}>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
                <button type="submit">Delete User</button>
            </form>
        </div>
    );
}

export default DeleteAccount_User;