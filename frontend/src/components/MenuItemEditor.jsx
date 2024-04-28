import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { backendURL } from './../urls'; // import backendURL from urls.js

function MenuItemEditor() {
    const { id } = useParams();
    const [menuItem, setMenuItem] = useState(null);

    useEffect(() => {
        // Fetch the menu item when the component mounts
        axios.get(`${backendURL}/api/menuItems/${id}`)
            .then(response => {
                setMenuItem(response.data);
            })
            .catch(error => {
                console.error('Error fetching menu item:', error);
            });
    }, [id]);

    const handleInputChange = (event) => {
        setMenuItem({
            ...menuItem,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(`/api/menuItems/${id}`, menuItem)
            .then(response => {
                console.log('Menu item updated:', response.data);
            })
            .catch(error => {
                console.error('Error updating menu item:', error);
            });
    };

    if (!menuItem) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={menuItem.name} onChange={handleInputChange} />
            </label>
            <label>
                Price:
                <input type="number" name="price" value={menuItem.price} onChange={handleInputChange} />
            </label>
            <button type="submit">Update</button>
        </form>
    );
}

export default MenuItemEditor;