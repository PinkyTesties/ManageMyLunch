//api/login.js

/**
THis is the api code for the login. It is used to login drivers.
It is based on Books.js from Logrocket's MERN stack tutorial: https://blog.logrocket.com/mern-stack-tutorial/

Created by Tyler Costa 19075541

 */
const express = require('express');
const router = express.Router();

// Get Driver model
const Driver = require('../../models/Drivers');

// @route   POST api/login
// @desc    Login driver
// @access  Public
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Find driver by email
  Driver.findOne({ email })
    .then(driver => {
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      // Check if password matches
      if (driver.password === password) {
        // Password matches, send success response
        //This sets teh session data
        req.session.name = driver.name;
        req.session.id = driver._id;
        req.session.email = driver.email;

        console.log(req.session.name);
        console.log(req.session.id);
        console.log(req.session.email);
        //console.log(req.session.driver);


        return res.json({ success: true});
      } else {
        // Password doesn't match, send error response
        return res.status(400).json({ error: 'Invalid password' });
      }
    })
    .catch(err => {
      console.error('Error logging in:', err);
      return res.status(500).json({ error: 'Internal server error' });
    });
});


module.exports = router;
