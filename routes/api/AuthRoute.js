// Initiate express router
// Require AuthController
// Create a route for signup and call the Signup function from AuthController
// Export the router

const { Signup } = require('../../controllers/AuthController');
const router = require('express').Router();

router.post('/signup', Signup);
module.exports = router;