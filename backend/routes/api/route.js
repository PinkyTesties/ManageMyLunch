const express = require('express');
const router = express.Router();

const googleMapsClient = require('@google/maps').createClient({
    key: "AIzaSyCitl6yX_uVB95MJzBdlACmT5sy5j0vcZc", 
    Promise: Promise
});

router.post('/', (req, res) => {
    const { origin, destination } = req.body;
   
    console.log(`Requesting directions from ${origin} to ${destination}`);

    googleMapsClient.directions({
        origin: origin,
        destination: destination,
        mode: 'driving'
    }).asPromise()
    .then(response => {
        if (response.json.status !== 'OK') {
            console.error('Google Maps API error:', response.json.status);
            return res.status(500).json({ error: 'Google Maps API error', details: response.json.status });
        }
        
        const routes = response.json.routes;
        if (!Array.isArray(routes) || routes.length === 0) {
            console.error('Routes data is not valid or empty');
            return res.status(500).json({ error: 'Routes data is not valid or empty' });
        }
        
        res.json(routes);
    })
    .catch(error => {
        console.error('Error fetching directions:', error);
        res.status(500).json({ error: 'Failed to plan route', details: error.message });
    });
});

module.exports = router;




