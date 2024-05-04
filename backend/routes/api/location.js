const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { latitude, longitude } = req.body;
    
    res.json({ status: 'Location received', latitude, longitude });
});

module.exports = router;
