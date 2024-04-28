import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

const MenuItemViewer = () => {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();
  const [ingredientCounts, setIngredientCounts] = useState({});
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          setUniversity(res.data.university);
          setUserID(res.data._id);
        } else {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    // Fetch the menu item data using the ID from the URL
    // Replace the API_URL with your actual API endpoint
    fetch(`http://localhost:8082/api/menuItems/${id}`)
      .then(response => response.json())
      .then(data => {
        setMenuItem(data);
        // Initialize ingredient counts
        const initialCounts = {};
        data.ingredients.forEach(ingredient => {
          initialCounts[ingredient.name] = ingredient.quantity; // set the initial count to the ingredient's default quantity
        });
        setIngredientCounts(initialCounts);
      })
      .catch(error => console.error(error));
  }, [id]);

  const incrementIngredient = (ingredient) => {
    setIngredientCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      if (newCounts[ingredient] < 5) { // sets maximum to 5
        newCounts[ingredient]++;
      }
      return newCounts;
    });
  };

  const decrementIngredient = (ingredient) => {
    setIngredientCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      if (newCounts[ingredient] > 0) { // sets minimum to 0
        newCounts[ingredient]--;
      }
      return newCounts;
    });
  };

  const handleInstructionsChange = (event) => {
    setInstructions(event.target.value);
  };

  const handleIngredientQuantityChange = (ingredientName, newQuantity) => {
    setIngredientCounts(prevCounts => ({
      ...prevCounts,
      [ingredientName]: newQuantity
    }));
  };

  const addToCart = async () => {
    try {
      // Prepare the menu item data
      const cartItem = {
        menuItemId: menuItem._id,
        name: menuItem.name,
        cost: parseFloat(menuItem.cost) * quantity, // Multiply cost by quantity
        ingredients: menuItem.ingredients.map(ingredient => ({
          name: ingredient.name,
          quantity: ingredientCounts[ingredient.name] || ingredient.quantity // Use the updated quantity if available
        })),
        additional_information: instructions || menuItem.additional_information // Use the updated instructions if available
      };

      // Send a request to add an item to the cart
      const response = await axios.post('http://localhost:8082/api/cart/add', {
        email: email,
        menuItem: cartItem,
        restaurant_id: menuItem.restaurant_id // assuming the restaurant_id is stored in the menuItem object
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {menuItem ? (
        <>
        <header>
        <h3>{menuItem.name}</h3>
          <button>
            <Link to={`/MenuItemEditor/${menuItem._id}`}>Edit this item</Link>
          </button>
          </header>
          <hr/>
          <div>   
            <p>Description: {menuItem.item_desc}</p>
            <p>Ingredients:</p>
            {menuItem.ingredients.map((ingredient, index) => (
              <div className='menu-item' key={index}>
                <span>{ingredient.name}: </span>
                <span>{ingredientCounts[ingredient.name]}</span>
                <button onClick={() => incrementIngredient(ingredient.name)}>+</button>
                <button onClick={() => decrementIngredient(ingredient.name)}>-</button>
              </div>
            ))}
            <br></br>
            <textarea value={instructions} onChange={handleInstructionsChange} placeholder="Additional instructions..."></textarea>
          </div>
          <br></br>
          <button onClick={addToCart}>Add to cart</button>

        </>
      ) : null}
    </div>
  );
};

export default MenuItemViewer;