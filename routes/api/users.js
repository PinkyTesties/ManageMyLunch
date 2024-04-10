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

// @route   GET api/:id
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
  const newUser = new User(req.body);

  newUser.save()
    .then(user => res.json({ msg: 'User added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this user' }));
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

// @route   POST api/users/delete
// @desc    Delete users
// @access  Public
router.post('/delete', async (req, res) => {
  const { email, password } = req.body;

  console.log(`Deleting user email: ${email}, password: ${password}`);

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(400).json({ error: 'No such user or incorrect password' });
    }

    // Check password
    if (password !== user.password) {
      console.log(`Password does not match for user with email: ${email}`);
      return res.status(400).json({ error: 'No such user or incorrect password' });
    }

    // Delete the user
    await User.deleteOne({ email });

    console.log(`User with email: ${email} deleted successfully`);
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.log(`Error deleting user with email: ${email}`, err);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;