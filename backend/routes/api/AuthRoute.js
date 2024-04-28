
const express = require('express');
const router = express.Router();

// Import the signup controller
const { Signup } = require('../../controller/AuthController');

// Define the signup route
router.post('/signup', Signup);

module.exports = router;