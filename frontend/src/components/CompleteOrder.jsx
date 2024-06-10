import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import logo from './componentAssets/logov1.png';


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
      const response = await fetch(`http://localhost:8082/api/completedCarts/complete/${cart._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: 'Completed' }),
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
      // Add points to user profile
      const amountPoints = cart.cost;
      console.log("The points to add are: ", amountPoints);

      // Fetch the user by email
      const userResponse = await fetch(`http://localhost:8082/api/users/email/${cart.email}`);
      const user = await userResponse.json();

      // Calculate the new reward points
      const newRewardPoints = (user.rewardsPoints || 0) + amountPoints;

      // Update the user's reward points
      await fetch(`http://localhost:8082/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardsPoints: newRewardPoints }),
      });

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
      const response = await fetch(`http://localhost:8082/api/completedCarts/code/${codeToInsert}`);
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
<<<<<<< HEAD:frontend/manage_my_lunch/src/components/CompleteOrder.jsx
      <header>
      <img src={logo} alt='Logo' height={100} />
      <h1>Complete your order</h1>
      <p></p>
      </header>
        <hr />
        <h6>Enter your order number to mark it as complete, or scan your qr code to mark as complete.</h6>
        <div className='delete-user'>
        <input type="text" onChange={handleInputChange} />
=======
      <h2>Complete your order</h2>
      <hr />
      <p>Enter your order number to mark it as complete, or scan your qr code to mark as complete.</p>
      <input type="text" onChange={handleInputChange} />
>>>>>>> b944fe787571675b27498ea2457756757baa57af:frontend/src/components/CompleteOrder.jsx
      <button onClick={handleManualSearch}>Search</button>
      <div><h4>{code}</h4></div>
        </div>
      
      <div>
        <p>{message}</p>
        {cart && (
<<<<<<< HEAD:frontend/manage_my_lunch/src/components/CompleteOrder.jsx
      
      <div className='complete-order'>
        <br />
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
    <QrReader className='qrcode'
      onResult={handleScan} 
      onError={handleError} />
      </div>
=======
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



>>>>>>> b944fe787571675b27498ea2457756757baa57af:frontend/src/components/CompleteOrder.jsx
    </div>
  );
};

export default CompleteOrder;