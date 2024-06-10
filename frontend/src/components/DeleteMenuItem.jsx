import React, { useState } from 'react';
import logo from './componentAssets/logov1.png';

const DeleteMenuItem = () => {
    const [id, setId] = useState('');

    const deleteMenuItem = () => {
        fetch(`http://localhost:8082/api/menuItems/${id}`, {
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
            <header>
          <img src={logo} alt='Logo' height={100} />
          <h1>Delete Menu Item</h1>
          <p></p>
        </header>
        <hr />
        <div className='delete-user'>
        <form onSubmit={(e) => { e.preventDefault(); deleteMenuItem(); }}>
                <input type="text" placeholder='Enter name of menu item' value={id} onChange={(e) => setId(e.target.value)} required />
                <button type="submit">Delete Menu Item</button>
            </form>
        </div>
            
        </div>
    );
}

export default DeleteMenuItem;