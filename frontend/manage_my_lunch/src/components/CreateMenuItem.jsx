import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

const CreateMenuItem = () => {
  const params = useParams();

  const [menuItem, setMenuItem] = useState({
    name: '',
    cost: '',
    date_added: new Date(),
    item_desc: '',
    restaurant_id: params.id,
    ingredients: [{ name: '', quantity: 0 }],
    additional_information: ''
  });

  const onChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
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
  
    const isValid = menuItem.ingredients.every(
      ingredient => ingredient.name && ingredient.quantity
    );
  
    if (!isValid) {
      alert('Each ingredient must have a name and a quantity.');
      return;
    }
  
    const menuItemWithQuantityAsString = {
      ...menuItem,
      ingredients: menuItem.ingredients.map(ingredient => ({
        ...ingredient,
        quantity: String(ingredient.quantity)
      }))
    };
  
    axios
      .post('http://localhost:8082/api/menuItems', menuItemWithQuantityAsString)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h3>Create New Menu Item</h3>
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
        <div className="form-group">
          <input type="submit" value="Create Menu Item" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};

export default CreateMenuItem;
