/*
  This component is used to create a new menu item. The user can input the name, cost, description, ingredients,
   additional information, and image of the menu item. 
   The user can also add multiple ingredients to the menu item. 
   
   The user can then submit the form to create the menu item. 
  The image name is stored as a string in the menuItem object. The image itself is sent to the backend locally 

  Created by Tyler Costa 19075541
*/
//React imports
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import UserDashboard from './UserDashboard'; //Import header
import axios from 'axios';
import Footer from './sharedComponents/Footer'; //Import Footer
import '../style/CreateMenuItem.css'; //styles

const CreateMenuItem = () => {

  
  const params = useParams();
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  //Creates a menuItem object, similar to menutItem.js model
  const [menuItem, setMenuItem] = useState({
    name: '',
    cost: '',
    date_added: new Date(),
    item_desc: '',
    menuItemImage: '',
    restaurant_id: params.id,
    ingredients: [{ name: '', quantity: 0 }],
    additional_information: ''
  });

  //Handles input changes
  const onChange = (e) => {
    if (e.target.name === 'image') {
      setImage(e.target.files[0]);
      setMenuItem({ ...menuItem, menuItemImage: e.target.files[0].name });
    } else {
      setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
    }
  };

  //Handle ingredient change
  const onIngredientChange = index => e => {
    const newIngredients = menuItem.ingredients.map((ingredient, i) => {
      if (i !== index) return ingredient;
      const value = e.target.name === 'quantity' ? parseInt(e.target.value, 10) : e.target.value;
      return { ...ingredient, [e.target.name]: value };
    });


    setMenuItem(prevState => ({
      ...prevState,
      ingredients: newIngredients
    }));
  };

  //Add the ingredient
  const addIngredient = () => {
    setMenuItem(prevState => ({
      ...prevState,
      ingredients: [...prevState.ingredients, { name: '', quantity: 0 }]
    }));
  };

  //Submit the form, image and menuItem object.

  const onSubmit = (e) => {
    e.preventDefault();
    // Create a new FormData object
    const formData = new FormData(); 
    formData.append('name', menuItem.name);
    formData.append('cost', menuItem.cost);
    formData.append('date_added', menuItem.date_added);
    formData.append('item_desc', menuItem.item_desc);
    formData.append('restaurant_id', menuItem.restaurant_id);
    formData.append('ingredients', JSON.stringify(menuItem.ingredients));
    formData.append('additional_information', menuItem.additional_information);
    formData.append('image', image);

    axios
    //Input the form data into the backend
      .post("http://localhost:8082/api/menuItems", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        // handle success
        alert("Menu item added successfully!");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("Error in CreateMenuItem!");
      });
  };

//Display the page content 
  return (
    <div>
      <UserDashboard />
        <div className="container">
          <br></br>
        <h3>Create New Menu Item</h3>

      <div className='mainContentContainer'>

      {/**Form content aking for name, cost, desc, ID(auto populated), ingredients, additional information, image */}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name: </label>
          <input type="text" required className="form-control" name="name" value={menuItem.name} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Cost: </label>
          <input type="text" className="form-control" name="cost" value={menuItem.cost} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Description: </label>
          <input type="text" className="form-control" name="item_desc" value={menuItem.item_desc} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Restaurant ID: </label>
          <input type="text" required className="form-control" name="restaurant_id" value={menuItem.restaurant_id} onChange={onChange} />
        </div>

        <div className="form-group">
          {/* User can add and view more ingredients here */}
          <label>Ingredients: </label>
          {menuItem.ingredients.map((ingredient, index) => (
            <div key={index}>
              <input
                type="text"
                className="form-control"
                name="name"
                value={ingredient.name}
                onChange={onIngredientChange(index)}
              />
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={ingredient.quantity}
                onChange={onIngredientChange(index)}
              />
            </div>
          ))}
          <button type="button" onClick={addIngredient}>Add Another Ingredient</button>
        </div>
        <div className="form-group">
          <label>Additional Information: </label>
          <input type="text" className="form-control" name="additional_information" value={menuItem.additional_information} onChange={onChange} />
        </div>
        <br></br>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            name="image"
            className="form-control"
            onChange={onChange}
          />
        </div>

        <br></br>
        <div className="form-group">
          <input type="submit" value="Create Menu Item" className="btn btn-primary" />
        </div>
      </form>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateMenuItem;
