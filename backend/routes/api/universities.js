// routes/universities.js
const express = require('express');
const router = express.Router();
const University = require('../../models/University');

// Get all universities
router.get('/', async (req, res) => {
  const universities = await University.find();
  res.json(universities);
});

// Get one university
router.get('/:id', async (req, res) => {
  const university = await University.findById(req.params.id);
  res.json(university);
});

// Create a university
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
// Update a university
router.patch('/:id', async (req, res) => {
  const updatedUniversity = await University.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.json(updatedUniversity);
});

// Delete a university
router.delete('/:id', async (req, res) => {
    const removedUniversity = await University.deleteOne({ _id: req.params.id });
    res.json(removedUniversity);
  });

// Get university by name
router.get('/name/:name', async (req, res) => {
  const university = await University.findOne({ name: req.params.name });
  res.json(university);
});

module.exports = router;