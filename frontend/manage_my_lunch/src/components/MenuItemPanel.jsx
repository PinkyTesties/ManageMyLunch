import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const MenuItemPanel = ({ menuItem }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [userID, setUserID] = useState('');
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:8082')
      .then((res) => {


        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          setUniversity(res.data.university);
          setUserID(res.data._id);

        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err))
  }, [])

  // const addToCart = async () => {
  //   try {
  //     // Send a request to add an item to the cart
  //     const response = await axios.post('http://localhost:8082/api/cart/add', {
  //       email: email,
  //       menuItem: menuItem,
  //       quantity: quantity,
  //       restaurant_id: menuItem.restaurant_id // assuming the restaurant_id is stored in the menuItem object
  //     });

  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }


  const addToCart = async () => {
    try {
      // Prepare the menu item data
      const cartItem = {
        menuItemId: menuItem._id,
        name: menuItem.name,
        cost: parseFloat(menuItem.cost) * quantity, // Multiply cost by quantity

        ingredients: [],
        additional_information: ""
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
  }


  return (
    <div className='menucard-container'>
      <img
        src={`http://localhost:8082/menuItem_assets/${menuItem.menuItemImage}`}

        alt='Menu Item'
        height={100}
      />
      <div className='desc'>
        <div>
          <h2>
            <Link to={`/MenuItemViewer/${menuItem._id}`}>{menuItem.name}</Link>
          </h2>
          <h3>${menuItem.cost.toFixed(2)}</h3>
        </div>
      </div>
      <p>{menuItem.item_desc}</p>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
};

export default MenuItemPanel;