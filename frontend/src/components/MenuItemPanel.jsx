import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import './buttonTeststyle.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import '../style/MenuItemPanel.css';

const MenuItemPanel = ({ menuItem }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [userID, setUserID] = useState('');
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const [hidden, setHidden] = useState(false);
  const [animateCheck, setAnimateCheck] = useState(false);
  const [animateMessage, setAnimateMessage] = useState(false);

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
  }, [navigate]);

  const addToCart = async () => {
    try {
      const cartItem = {
        menuItemId: menuItem._id,
        name: menuItem.name,
        cost: parseFloat(menuItem.cost) * quantity,
        ingredients: [],
        additional_information: "",
        menuItemImage: menuItem.menuItemImage
      };

      const response = await axios.post('http://localhost:8082/api/cart/add', {
        email: email,
        menuItem: cartItem,
        restaurant_id: menuItem.restaurant_id
      });

      setHidden(true);
      setAnimateCheck(true);
      setAnimateMessage(true);

      setTimeout(() => {
          setHidden(false);
          setAnimateCheck(false);
          setAnimateMessage(false);
      }, 4000); 

      console.log(response.data);

    } catch (error) {
      console.error(error);
    }
  }
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:8082/api/menuItems/${id}`);
        console.log(response.data.msg); // Log the server's response message
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className='menucard-container'>
      <div className='item'>
        <Link to={`/MenuItemViewer/${menuItem._id}`}>
          <img
            src={`http://localhost:8082/menuItem_assets/${menuItem.menuItemImage}`}
            alt='Menu Item'
            height={200}
          />
        </Link>
        <br></br>
        <br></br>

        <span><p>{menuItem.name}</p></span>
        <hr></hr>
      </div>
      
      <p>${menuItem.cost.toFixed(2)}</p>
      <br></br>
      <p>{menuItem.item_desc}</p>

      <button className={`animatedCartBtn ${hidden ? 'hide' : ''}`} id="btn" onClick={addToCart}>
        Add To Cart
      </button>
      <button className='deleteButton' onClick={() => handleDelete(menuItem._id)}> Delete Item</button>
      <div className="row">
        <span className={`check ${animateCheck ? 'rotateIn' : ''}`} id="check">
          <i className="bi bi-check-lg"></i>
        </span>
        <span className={`message ${animateMessage ? 'fadeIn' : ''}`} id="message">
          Added To Cart
        </span>
      </div>
    </div>
  );
};

export default MenuItemPanel;
