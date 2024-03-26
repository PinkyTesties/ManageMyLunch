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
          initialCounts[ingredient] = 1; // set the initial count to 1
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
  const addToCart = async () => {
    try {
      // Send a request to add an item to the cart
      const response = await axios.post('http://localhost:8082/api/cart/add', {
        email: email,
        menuItem: menuItem,
        quantity: quantity,
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
          <button>
            <Link to={`/MenuItemEditor/${menuItem._id}`}>Edit this item</Link>
          </button>

          <h3>Menu item: {menuItem.name} ({menuItem._id})</h3>
          <div>
            <p>Name: {menuItem.name} email: {email}</p>
            <p>Description: {menuItem.item_desc}</p>
            <p>Ingredients:</p>
            {menuItem.ingredients.map(ingredient => (
              <div key={ingredient} style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ marginRight: '10px' }}>{ingredient}: {ingredientCounts[ingredient]}</p>
                <button onClick={() => decrementIngredient(ingredient)}>-</button>
                <button onClick={() => incrementIngredient(ingredient)}>+</button>
              </div>
            ))}
            <textarea value={instructions} onChange={handleInstructionsChange} placeholder="Additional instructions..."></textarea>
          </div>
          <button onClick={addToCart}>Add to cart</button>

        </>
      ) : null}
    </div>
  );
};

export default MenuItemViewer;