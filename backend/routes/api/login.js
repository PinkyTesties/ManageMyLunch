//api/login.js

const express = require('express');
const router = express.Router();

// Load User model
const User = require('../../models/Users');
 
// @route   POST api/login
// @desc    Login user
// @access  Public
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if password matches
      if (user.password === password) {
        // Password matches, send success response

        req.session.name = user.name;
        req.session.university = user.university;
        req.session.id = user._id;
        req.session.email = user.email;

        console.log(req.session.name);
        console.log(req.session.university);
        console.log(req.session.id);
        console.log(req.session.email);
        //console.log(req.session.user);
        console.log('Session data:', req.session);


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
