
// routes/universities.js
/*
This is the api code for the universities. It is used to create, get, update and delete universities.

Created by Tyler Costa 19075541

*/

const express = require('express');
const router = express.Router();
const University = require('../../models/University');

// @route   GET api/universities/
// @desc    Get all universities
// @access  Public
router.get('/', async (req, res) => {
  const universities = await University.find();
  res.json(universities);
});

// @route   GET api/universities/:id
// @desc    Get a specific university by ID
// @access  Public
router.get('/:id', async (req, res) => {
  const university = await University.findById(req.params.id);
  res.json(university);
});

// @route   POST api/universities/
// @desc    Create a new university 
// @access  Public
router.post('/', async (req, res) => {
    const { name, address, coordinates } = req.body;
    const { latitude, longitude } = coordinates;
    
    const university = new University({
      name,
      address,
      coordinates: {
        latitude,
        longitude
      }
    });
  
    const savedUniversity = await university.save();
    res.json(savedUniversity);
  });

// @route   PUT api/universities/:id
// @desc    Delete a university by ID
// @access  Public
  router.delete('/:id', async (req, res) => {
    const removedUniversity = await University.deleteOne({ _id: req.params.id });
    res.json(removedUniversity);
  });

// @route   GET api/universities/name/:name
// @desc    Get a specific university by name
// @access  Public
router.get('/name/:name', async (req, res) => {
  const university = await University.findOne({ name: req.params.name });
  res.json(university);
});

module.exports = router;