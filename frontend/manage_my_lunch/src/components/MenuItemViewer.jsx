import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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

    // ... existing code

return (
    <div>
      {menuItem ? (
        <>
          <button>
            <Link to={`/MenuItemEditor/${menuItem._id}`}>Edit this item</Link>
          </button>
                
          <h3>Menu item: {menuItem.name} ({menuItem._id})</h3>
          <div>
            <p>Name: {menuItem.name}</p>
            <p>Description: {menuItem.item_desc}</p>
            <p>Ingredients:</p>
            <ul>
              {menuItem.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            {/* Add more JSX to display other properties of the menu item */}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  df
  // ... existing code
};

export default MenuItemViewer;