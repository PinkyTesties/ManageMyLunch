import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import UserDashboard from './UserDashboard';
import axios from 'axios';
import Footer from './sharedComponents/Footer';
import '../style/CreateMenuItem.css';

const CreateMenuItem = () => {
  const params = useParams();
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

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


  const onChange = (e) => {
    if (e.target.name === 'image') {
      setImage(e.target.files[0]);
      setMenuItem({ ...menuItem, menuItemImage: e.target.files[0].name });
    } else {
      setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
    }
  };

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

  const addIngredient = () => {
    setMenuItem(prevState => ({
      ...prevState,
      ingredients: [...prevState.ingredients, { name: '', quantity: 0 }]
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', menuItem.name);
    formData.append('cost', menuItem.cost);
    formData.append('date_added', menuItem.date_added);
    formData.append('item_desc', menuItem.item_desc);
    formData.append('restaurant_id', menuItem.restaurant_id);
    formData.append('ingredients', JSON.stringify(menuItem.ingredients)); // Convert array to JSON string
    formData.append('additional_information', menuItem.additional_information);
    formData.append('image', image);

    axios
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


  return (
    <div>
      <UserDashboard />
        <div className="container">
          <br></br>
        <h3>Create New Menu Item</h3>

      <div className='mainContentContainer'>

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
