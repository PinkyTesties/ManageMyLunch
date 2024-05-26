/*
This is a file that contains testing for sending emails and push notifications. It is not used in the final product.
But it is a good example of how to send emails and push notifications in a React application. And I will use it as a reference when its required in the future.

Tyler Costa 19075541


REFERENCES:

M, tech(2023, March 12). Send Email through Forms : React Js | Email js [Video]. YouTube. https://www.youtube.com/watch?v=Nm_IHH4iOx4&ab_channel=techM
*/

//React imports
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
//Import pushNotification function
import { pushNotification } from './jsFiles/pushNotifications';

const EmailTest = () => {
    //Variables
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Message:', message);
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

    const title = "Manage My Lunch";
    const content = "This is a test notification from Manage My Lunch.";

    return (
        <div>
            <form onSubmit={sendEmail}>
                <label>
                    Email:
                    <input type="email" name="email_from" value={email} onChange={handleEmailChange} />
                </label>
                <br />
                <label>
                    Message:
                    <input type="text" name="message" value={message} onChange={handleMessageChange} />
                </label>
                <br />
                <button type="submit">Send email</button>
            </form>
            <button onClick={(e) => pushNotification(e, title, content)}>Send a notification</button>
        </div>
    );
};

export default EmailTest;