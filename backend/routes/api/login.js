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
// Check if password matches
if (user.password === password) {
  // Password matches, send success response

  req.session.user = {
    name: user.name,
    university: user.university,
    userId: user._id,
    email: user.email
  };
  
  req.session.save(err => {
    if (err) {
      console.error('Error saving session:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ 
      success: true,
      user: {
        name: req.session.name,
        university: req.session.university,
        userId: req.session.userId,
        email: req.session.email
      }
    });
  });
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
