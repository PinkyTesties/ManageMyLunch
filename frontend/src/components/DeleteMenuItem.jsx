import React, { useState } from 'react';
import { backendURL } from '../urls';

const DeleteMenuItem = () => {
    const [id, setId] = useState('');

    const deleteMenuItem = () => {
        fetch(`${backendURL}/api/menuItems/${id}`, {
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
                alert('Menu item deleted successfully'); // Display success message
                window.location = '/dashboard'; // Redirect to dashboard
            } else if (data.error) {
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h1>Delete Menu Item</h1>
            <form onSubmit={(e) => { e.preventDefault(); deleteMenuItem(); }}>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
                <button type="submit">Delete Menu Item</button>
            </form>
        </div>
    );
}

export default DeleteMenuItem;