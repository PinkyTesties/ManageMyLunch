import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const EmailTest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleMessageChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your sign-up logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    const sendEmail = (e) => {
        e.preventDefault();
    
        const templateParams = {
            email_from: email,
            message: message,
        };
    
        emailjs.send('service_gmcskkn', 'template_v78bl21', templateParams, 'XfgsvummwbkF3G1dV')
            .then((response) => {
               console.log('SUCCESS!', response.status, response.text);
            }, (err) => {
               console.log('FAILED...', err);
            });
    
        console.log('Email:', email);
        console.log('Message:', message);
    };

    return (
        <form onSubmit={sendEmail}>
            <label>
                Email:
                <input type="email" name="email_from" value={email} onChange={handleEmailChange} />
            </label>
            <br />
            <label>
                Message:
<input type="text" name="message" value={message} onChange={e => setMessage(e.target.value)} />
            </label>
            <br />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default EmailTest;