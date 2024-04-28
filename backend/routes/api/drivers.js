const express = require('express');
const router = express.Router();

// Load Driver model
const Driver = require('../../models/Drivers');

// @route   GET api/drivers/test
// @desc    Tests drivers route
// @access  Public
router.get('/test', (req, res) => res.send('drivers route testing!'));

// @route   GET api/drivers
// @desc    Get all drivers
// @access  Public
router.get('/', (req, res) => {
  Driver.find()
    .then(drivers => res.json(drivers))
    .catch(err => res.status(404).json({ nodriverfound: 'No Drivers found' }));
});

// @route   GET api/drivers/:id
// @desc    Get single driver by id
// @access  Public
router.get('/:id', (req, res) => {
  Driver.findById(req.params.id)
    .then(driver => res.json(driver))
    .catch(err => res.status(404).json({ nodriverfound: 'No Driver found' }));
});

// @route   GET api/drivers/email/:email
// @desc    Get single driver by email
// @access  Public
router.get('/email/:email', (req, res) => {
  Driver.findOne({ email: req.params.email })
    .then(driver => {
      if (!driver) {
        return res.status(404).json({ nodriverfound: 'No Driver found' });
      }
      res.json(driver);
    })
    .catch(err => res.status(500).json({ error: 'Error fetching driver by email' }));
});


// @route   POST api/drivers
// @desc    Add/save driver
// @access  Public
router.post('/', (req, res) => {
  Driver.create(req.body)
    .then(driver => res.json({ msg: 'Driver added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this driver' }));
});

// @route   PUT api/drivers/:id
// @desc    Update driver by id
// @access  Public
router.put('/:id', (req, res) => {
  Driver.findByIdAndUpdate(req.params.id, req.body)
    .then(driver => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   DELETE api/drivers/:id
// @desc    Delete driver by id
// @access  Public
router.delete('/:id', (req, res) => {
  Driver.findByIdAndDelete(req.params.id)
    .then(driver => res.json({ msg: 'Driver entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a driver' }));
});

module.exports = router;