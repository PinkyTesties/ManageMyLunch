import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboard from './UserDashboard'; // Import UserDashboard
import '../style/MenuItemEditor.css';
import Footer from './sharedComponents/Footer';

function MenuItemEditor() {
    const { id } = useParams();
    const [menuItem, setMenuItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the menu item when the component mounts
        axios.get(`http://localhost:8082/api/menuItems/${id}`)
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

    const userConfirmed = window.confirm(`Are you sure you want to change the price to ${menuItem.cost}?`);

    if (userConfirmed) {
        axios.put(`http://localhost:8082/api/menuItems/${id}`, menuItem)
            .then(response => {
                console.log('Menu item updated:', response.data);
                navigate('/dashboard'); // navigate to dashboard
            })
            .catch(error => {
                console.error('Error updating menu item:', error);
            });
    }
};

    if (!menuItem) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="MenuItemEditor">
                <UserDashboard /> {/* Use UserDashboard */}

                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={menuItem.name} onChange={handleInputChange} />
                    </label>
                    <label>
                        Price:
                        <input type="number" name="cost" value={menuItem.cost} onChange={handleInputChange} />            </label>
                    <button type="submit">Update</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default MenuItemEditor;