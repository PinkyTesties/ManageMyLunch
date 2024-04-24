import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from './componentAssets/logov1.png';
import axios from 'axios';

const CreateMenuItem = () => {
  const params = useParams();
  const [image, setImage] = useState(null);

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

  // const onSubmit = (e) => {
  //   e.preventDefault();

  //   const isValid = menuItem.ingredients.every(
  //     ingredient => ingredient.name && ingredient.quantity
  //   );

  //   if (!isValid) {
  //     alert('Each ingredient must have a name and a quantity.');
  //     return;
  //   }

  //   const menuItemWithQuantityAsString = {
  //     ...menuItem,
  //     ingredients: menuItem.ingredients.map(ingredient => ({
  //       ...ingredient,
  //       quantity: String(ingredient.quantity)
  //     }))
  //   };

  //   axios
  //     .post('http://localhost:8082/api/menuItems', menuItemWithQuantityAsString)
  //     .then((res) => console.log(res.data))
  //     .catch((err) => console.error(err));
  // };

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
      })
      .catch((err) => {
        console.log("Error in CreateMenuItem!");
      });
  };


  return (
    <div>
      <header>
        <img src={logo} alt='Logo' height={100} />
        <h1>Create New Menu Item</h1>
        <p></p>
      </header>
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <br />
            <p className="lead text-center">Create new Menu Item</p>
          </div>
          <div className="col-md-10 m-auto">
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label>Name: </label>
                <input type="text" required className="form-control" name="name" value={menuItem.name} onChange={onChange} />
              </div>
              <br />
              <div className="form-group">
                <label>Cost: </label>
                <input type="text" className="form-control" name="cost" value={menuItem.cost} onChange={onChange} />
              </div>
              <br />
              <div className="form-group">
                <label>Description: </label>
                <input type="text" className="form-control" name="item_desc" value={menuItem.item_desc} onChange={onChange} />
              </div>
              <br />
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
          </div>
          </div>
          );
};

          export default CreateMenuItem;
