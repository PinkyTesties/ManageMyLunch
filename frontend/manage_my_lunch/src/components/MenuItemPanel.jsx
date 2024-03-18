import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const MenuItemPanel = ({menuItem}) => {

  return (
    <div className='menucard-container'>
      <img
        src='https://i.kym-cdn.com/entries/icons/facebook/000/043/027/metalpipefalling.jpg'
        alt='Menu Item'
        height={100}
      />
      <div className='desc'>
        <h2>
          <Link to={`/MenuItemViewer/${menuItem._id}`}>{menuItem.name}</Link>
        </h2>
        <button>Add to cart</button> {/* Add this line */}

        <h3>${menuItem.cost}</h3>
        <p>{menuItem.item_desc}</p>




      </div>
    </div>
  );
};

export default MenuItemPanel;