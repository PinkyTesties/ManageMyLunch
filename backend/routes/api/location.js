const express = require('express');
const router = express.Router();

// @route   POST api/location
// @desc    Receive location data
// @access  Public
router.post('/', (req, res) => {
    const { latitude, longitude } = req.body;
    
    res.json({ status: 'Location received', latitude, longitude });
});

module.exports = router;
