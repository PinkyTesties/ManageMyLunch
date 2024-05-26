
import React, { useState } from 'react';
import './buttonTeststyle.css';

const ButtonTest = () => {
    const [hidden, setHidden] = useState(false);
    const [animateCheck, setAnimateCheck] = useState(false);
    const [animateMessage, setAnimateMessage] = useState(false);

    const handleClick = () => {
        setHidden(true);
        setAnimateCheck(true);
        setAnimateMessage(true);

        setTimeout(() => {
            setHidden(false);
            setAnimateCheck(false);
            setAnimateMessage(false);
        }, 2000); // 5000 milliseconds = 5 seconds
    };

    

    return (
            <div className="container">
                <br></br>
                <br></br>

                <button className={`animatedCartBtn ${hidden ? 'hide' : ''}`} id="btn" onClick={handleClick}>
                    Add To Cart
                </button>
                <div className="row">
                    <span className={`check ${animateCheck ? 'rotateIn' : ''}`} id="check">
                        <i className="bi bi-check-lg"></i>
                    </span>
                    <span className={`message ${animateMessage ? 'fadeIn' : ''}`} id="message">
                        Added
                    </span>
                </div>
            </div>
        );
};

export default ButtonTest;


