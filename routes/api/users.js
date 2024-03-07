//api/users.js

const express = require('express');
const router = express.Router();

// Load User model
const User = require('../../models/Users');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.send('users route testing!'));

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ nouserfound: 'No Users found' }));
});

// @route   GET api/users/:id
// @desc    Get single users by id
// @access  Public
router.get('/:id', (req, res) => {
  User.findById(req.params.id)
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ nouserfound: 'No User found' }));
});

// @route   POST api/users
// @desc    Add/save users
// @access  Public
router.post('/', (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  
  User.create(req.body)
    .then(users => {
      console.log('User added successfully:', users); // Log the created user
      res.json({ msg: 'User added successfully' });
    })
    .catch(err => {
      console.error('Error adding user:', err); // Log the error
      res.status(400).json({ error: 'Unable to add this User', details: err.message });
    });
});


// @route   PUT api/users/:id
// @desc    Update users by id
// @access  Public
router.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(users => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   DELETE api/users/:id
// @desc    Delete users by id
// @access  Public
router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(users => res.json({ msg: 'users entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a users' }));
});



module.exports = router;
