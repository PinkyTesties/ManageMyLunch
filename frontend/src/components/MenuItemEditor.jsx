/*
This component is responsible for editing a menu item. It fetches the menu item from the API when called (from the routes file), 
Then the user can update its name and price using the <form action="" className=""></form>
When the user submits the form, If the update is successful, the component navigates to the dashboard page.

Created by Tyler Costa 19075541
*/

// React imports
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
//Header
import UserDashboard from './UserDashboard';
//Styles
import '../style/MenuItemEditor.css';
//Footer
import Footer from './sharedComponents/Footer';

function MenuItemEditor() {
    //Variables
    const { id } = useParams();
    const [menuItem, setMenuItem] = useState(null);
    const navigate = useNavigate();

    //Fetch the menu item
    useEffect(() => {
        axios.get(`http://localhost:8082/api/menuItems/${id}`)
            .then(response => {
                setMenuItem(response.data);
            })
            .catch(error => {
                console.error('Error fetching menu item:', error);
            });
    }, [id]);

    //Handle the input change
    const handleInputChange = (event) => {
        setMenuItem({
            ...menuItem,
            [event.target.name]: event.target.value
        });
    };

    //Handle the form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        const userConfirmed = window.confirm(`Are you sure you want to change the price to ${menuItem.cost}?`);

        if (userConfirmed) {
            axios.put(`http://localhost:8082/api/menuItems/${id}`, menuItem)
                .then(response => {
                    console.log('Menu item updated:', response.data);
                    //Navigate to the dashboard
                    navigate('/dashboard');
                })
                .catch(error => {
                    console.error('Error updating menu item:', error);
                });
        }
    };

    //If theres no menu item, it will display this
    if (!menuItem) {
        return <div>Loading...</div>;
    }

    //Render the menu item editor content
    return (
        <div>
            <div className="MenuItemEditor">
                {/* Header */}
                <UserDashboard /> 

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={menuItem.name} onChange={handleInputChange} />
                    </label>
                    <label>
                        Price:
                        <input type="number" name="cost" value={menuItem.cost} onChange={handleInputChange} />
                    </label>
                    <button type="submit">Update</button>
                </form>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}

export default MenuItemEditor;