import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { backendURL } from './../urls'; // import backendURL from urls.js


const CompleteOrder = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Add this line
    const [cart, setCart] = useState(null);

    const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value.length > 4) {
      setError('Input should be a four-digit number');
    } else if (!/^\d+$/.test(value)) {
      setError('Input should only contain digits');
    } else {
      setError('');
    }
    setCode(value);
  };


  const handleError = err => {
    setError(err);
  }

  const markComplete = async () => {
    try {
      const response = await fetch(`${backendURL}/api/completedCarts/complete/${cart._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: 'Completed' }),
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
      alert('Order marked as complete');

        // Navigate to the OrderStatus page
    navigate('/OrderStatus');

    } catch (err) {
      setError(err.message);
    }
  };

  const handleScan = async data => {
    if (data) {
      setCode(data.text);
      alert('Scanned ' + data.text + ' successful!');
      await insertCode(data.text);
    }
  }
  
  const handleManualSearch = async () => {
    await insertCode(code);
  }

  const insertCode = async (codeToInsert) => {
    if (!/^\d{4}$/.test(codeToInsert)) {
      setError('Code should be a four-digit number');
      return;
    }
  
    try {
      const response = await fetch(`${backendURL}/api/completedCarts/code/${codeToInsert}`);
      const fetchedCart = await response.json();
      if (fetchedCart && fetchedCart._id) {
        setMessage(`Found cart with code ${codeToInsert}`);
        setCart(fetchedCart); // Set the cart state variable
      } else {
        setMessage(`No cart found with code ${codeToInsert}`);
        alert(`No cart found with code ${codeToInsert}`);
        setCart(null); // Clear the cart state variable
      }
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div className='complete_order'>
        <h2>Complete your order</h2>
        <hr />
        <p>Enter your order number to mark it as complete, or scan your qr code to mark as complete.</p>
      <input type="text" onChange={handleInputChange} />
      <button onClick={handleManualSearch}>Search</button>
      <div><h4>{code}</h4></div>
      <div>
        <p>****** DISPLAY CONTENT HERE *******</p>
        <p>{message}</p>
        {cart && (
      <div className='complete-order'>
        <h3>Order Details:</h3>
        <p>Email: {cart.email}</p>
        <p>Restaurant: {cart.restaurant_name}</p>
        <p>Cost: ${cart.cost}</p>
        <p>Code: {cart.code}</p>
        {/* Add more fields as needed */}
        <br></br>
        <br></br>
        <button onClick={markComplete}>Mark Complete</button>
              </div>
    )}
      </div>

      
      <QrReader 
      onResult={handleScan} 
      onError={handleError} />
    


    </div>
  );
};

export default CompleteOrder;