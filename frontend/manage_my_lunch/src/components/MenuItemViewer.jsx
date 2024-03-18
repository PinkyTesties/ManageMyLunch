import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MenuItemViewer = () => {
    const { id } = useParams();
    const [menuItem, setMenuItem] = useState(null);

    useEffect(() => {
        // Fetch the menu item data using the ID from the URL
        // Replace the API_URL with your actual API endpoint
        fetch(`http://localhost:8082/api/menuItems/${id}`)
            .then(response => response.json())
            .then(data => setMenuItem(data))
            .catch(error => console.error(error));
    }, [id]);

    return (
        <div>
            {menuItem ? (
                <div>
                    <h2>{menuItem.name}</h2>
                    <p>{menuItem.item_desc}</p>
                    <p>{menuItem._id}</p>

                    {/* Add more JSX to display other properties of the menu item */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MenuItemViewer;