/*
Testing QR Code Reading and Generation

Created by Tyler Costa 19075541
*/

import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { QrReader } from 'react-qr-reader';

const CodeReader = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  const insertCode = async () => {
    if (!/^\d{4}$/.test(code)) {
      setError('Code should be a four-digit number');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8082/api/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setMessage(data.msg);
    } catch (error) {
      setError('Failed to insert code');
    }
  };

  const checkCode = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/code/number/${code}`);
    } catch (error) {
      setError('Failed to check code');
    }
  };

  return (
    <div>
      <input type="text" value={code} onChange={handleInputChange}/>
      <button onClick={insertCode}>Insert Code</button>
      <button onClick={checkCode}>Check Code</button>
      <QRCode value={code} />
      <QrReader
  delay={300}
  onError={handleError}
  onResult={handleScan}
  style={{ width: '50%', height: '30%', transform: 'scaleX(-1)' }}
/>
    </div>
  );
};

export default CodeReader;