import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming you're using axios for HTTP requests

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Fetch the order when the component mounts
    axios.get(`http://localhost:8082/api/completedCarts/id/${id}`)
      .then(response => {
        setOrder(response.data);
        console.log(response.data); // Add this line
      })
      .catch(error => console.error(`Error: ${error}`));
  }, [id]);

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

  const cancelOrder = () => {
    axios.delete(`http://localhost:8082/api/completedCarts/id/${id}`)
      .then(() => {
        alert('Order cancelled successfully');
        navigate('/OrderStatus');
      })
      .catch(error => console.error(`Error: ${error}`));
  };

  const removeItem = (itemIndex) => {
    if (order.menuItems.length <= 1) {
      alert('Cannot delete the last item');
      return;
    }

    setOrder(prevOrder => ({
      ...prevOrder,
      menuItems: prevOrder.menuItems.filter((item, index) => index !== itemIndex)
    }));
  };

  const submitChanges = () => {
    axios.put(`http://localhost:8082/api/completedCarts/id/${id}`, order)
      .then(() => {
        alert('Order updated successfully');
        navigate('/OrderStatus');
      })
      .catch(error => console.error(`Error: ${error}`));
  };

  if (!order) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>Edit Order</h1>
      <p>Order ID: {id}</p>
      {menuItems && menuItems.length > 0 && menuItems.map((item, index) => (
        <div key={index} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
          <p>{item.name}</p>
          <button onClick={() => removeItem(index)}>Remove Item</button>
        </div>
      ))}
      <button onClick={submitChanges}>Submit Changes</button>
      <button onClick={cancelOrder}>Cancel Order</button>
    </div>
  );
};

export default EditOrder;