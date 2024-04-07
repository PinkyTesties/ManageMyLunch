import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const CompleteOrder = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Add this line
    const [cart, setCart] = useState(null);

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

  const handleScan = data => {
    if (data) {
      setCode(data);
      alert('Scanned ' + data + ' successful!');
    }
  }

  const handleError = err => {
    setError(err);
  }

  const markComplete = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/completedCarts/complete/${cart._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: 'Completed' }),
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
      setMessage('Order marked as complete');
    } catch (err) {
      setError(err.message);
    }
  };

  const insertCode = async () => {
    if (!/^\d{4}$/.test(code)) {
      setError('Code should be a four-digit number');
      return;
    }
  
   try {
    const response = await fetch(`http://localhost:8082/api/completedCarts/code/${code}`);
    const fetchedCart = await response.json();
    if (fetchedCart && fetchedCart._id) {
      setMessage(`Found cart with code ${code}`);
      setCart(fetchedCart); // Set the cart state variable
    } else {
      setMessage(`No cart found with code ${code}`);
      setCart(null); // Clear the cart state variable
    }
  } catch (err) {
    setError(err.message);
  }
  }

  return (
    <div>
        <h2>Complete your order</h2>
        <p>Enter your order number to mark it as complete, or scan your qr code to mark as complete.</p>
      <input type="text" onChange={handleInputChange} />
      <button onClick={insertCode}>Search</button>
      <div><h4>{code}</h4></div>
      <div>
        <p>****** DISPLAY CONTENT HERE *******</p>
        <p>{message}</p>
        {cart && (
      <div>
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

      {error && <div>{error}</div>}
      <QrReader onScan={handleScan} onError={handleError} />
    


    </div>
  );
};

export default CompleteOrder;