/*  
EditOrder.jsx

This file is used to edit the order. The user can remove items from the order and submit the changes. The user can also cancel the order.
This file is called from the OrderStatus.jsx file. Which the user only has five minutes to click on

Created by Tyler Costa 19075541
*/

//React imports
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
//Header
import UserDashboard from './UserDashboard';
//Footer
import Footer from './sharedComponents/Footer';
//Styles
import '../style/editOrderPage.css'; 

const EditOrder = () => {
  //Variables
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  //Fetch the order
  useEffect(() => {
    axios.get(`http://localhost:8082/api/completedCarts/id/${id}`)
      .then(response => {
        setOrder(response.data);
        console.log(response.data);
      })
      .catch(error => console.error(`Error: ${error}`));
  }, [id]);

  //Fetch the menu items
  useEffect(() => {
    if (order && order.menuItems) {
      Promise.all(order.menuItems.map(itemId =>
        axios.get(`http://localhost:8082/api/menuItems/${itemId}`)
      )).then(responses => {
        const fetchedMenuItems = responses.map(res => res.data);
        setMenuItems(fetchedMenuItems);
      }).catch(error => console.error(`Error: ${error}`));
    }
  }, [order]);

  //Function to cancel the order
  const cancelOrder = () => {
    axios.delete(`http://localhost:8082/api/completedCarts/id/${id}`)
      .then(() => {
        //Alert the user that the order has been cancelled
        alert('Order cancelled successfully');
        //Navigate to the OrderStatus page
        navigate('/OrderStatus');
      })
      .catch(error => console.error(`Error: ${error}`));
  };

  //Function to remove an item from the order
  const removeItem = (itemIndex) => {
    if (order.menuItems.length <= 1) {
      //Alert the user that they cannot delete the last item
      alert('Cannot delete the last item');
      return;
    }

    //Remove the item from the order
    setOrder(prevOrder => ({
      ...prevOrder,
      menuItems: prevOrder.menuItems.filter((item, index) => index !== itemIndex)
    }));
  };

  //Function to submit the changes
  const submitChanges = () => {
    axios.put(`http://localhost:8082/api/completedCarts/id/${id}`, order)
      .then(() => {
        alert('Order updated successfully');
        navigate('/OrderStatus');
      })
      .catch(error => console.error(`Error: ${error}`));
  };

  //This displays if there is no order to edit, so basically only displays if the loading has failed
  if (!order) {
    return <p>Loading...</p>;
  }

  //Render the edit order page
  return (
    <div className="editPage-order-container">
    <div className="editPage-dashboard-container">
      {/*Header */}
      <UserDashboard />
    </div>
    <div className="editPage-edit-order-container">
      <h1 className="editPage-order-title">Edit Order</h1>
      <p className="editPage-order-id">Order ID: {id}</p>
      {/** Display the menu items */}
      {menuItems && menuItems.length > 0 && menuItems.map((item, index) => (
        <div key={index} className="editPage-item-container">
          <p className="editPage-item-name">{item.name}</p>
          <button className="editPage-remove-btn" onClick={() => removeItem(index)}>Remove Item</button>
        </div>
      ))}
      {/*Buttons to submit changes and cancel the order */}
      <button className="editPage-submit-btn" onClick={submitChanges}>Submit Changes</button>
      <button className="editPage-cancel-btn" onClick={cancelOrder}>Cancel Order</button>
    </div>
    {/**Footer */}
    <Footer />
  </div>
  );
};

export default EditOrder;