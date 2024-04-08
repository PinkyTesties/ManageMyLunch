// routes/api/codes.js
const express = require('express');
const router = express.Router();

// Load Code model
const Code = require('../../models/Code');

// @route   GET api/codes/test
// @desc    Tests codes route
// @access  Public
router.get('/test', (req, res) => res.send('code route testing!'));

// @route   GET api/codes
// @desc    Get all codes
// @access  Public
router.get('/', (req, res) => {
  Code.find()
    .then(codes => res.json(codes))
    .catch(err => res.status(404).json({ nocodesfound: 'No Codes found' }));
});

// @route   GET api/codes/:id
// @desc    Get single code by id
// @access  Public
router.get('/:id', (req, res) => {
  Code.findById(req.params.id)
    .then(code => res.json(code))
    .catch(err => res.status(404).json({ nocodefound: 'No Code found' }));
});

// @route   POST api/codes
// @desc    Add/save code
// @access  Public
router.post('/', (req, res) => {
  Code.create(req.body)
    .then(code => res.json({ msg: 'Code added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this code' }));
});

// @route   PUT api/codes/:id
// @desc    Update code by id
// @access  Public
router.put('/:id', (req, res) => {
  Code.findByIdAndUpdate(req.params.id, req.body)
    .then(code => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   DELETE api/codes/:id
// @desc    Delete code by id
// @access  Public
router.delete('/:id', (req, res) => {
  Code.findByIdAndDelete(req.params.id)
    .then(code => res.json({ mgs: 'Code entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a code' }));
});

// @route   GET api/codes/number/:number
// @desc    Get single code by number
// @access  Public
router.get('/number/:number', (req, res) => {
    Code.findOne({ code: req.params.number })
      .then(code => {
        if (code) {
          res.json(code);
        } else {
          res.status(404).json({ nocodefound: 'No Code found' });
        }
      })
      .catch(err => res.status(500).json({ error: 'Error fetching code' }));
  });

module.exports = router;