// import React from 'react';
// import './buttonTeststyle.css';
// // import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
// import './script.js';
// function ButtonTest() {
//     return (
//         <div>
//             <head>
//                 <meta charset="UTF-8"></meta>
//                     <title>My Page</title>
//                     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
//                     <link rel="stylesheet" href="buttonTeststyle.css"></link>
//             </head>
//             <h1>Hello World!</h1>
//             <body>
//                 <button className="btn" id="btn">Agree</button>
//                 <div className="row">
//                     <span className="check" id="check"><i class="bi bi-check-lg"></i></span>
//                     <span className="message" id="message">Done</span>
//                 </div>
//                 <script src="script.js"></script>
//                 </body>
//         </div>
//     );
// }
// export default ButtonTest;

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


