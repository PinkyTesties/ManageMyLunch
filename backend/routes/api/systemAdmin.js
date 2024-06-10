//systemAdmin.js

const express = require('express');
const router = express.Router();
const SystemAdmin = require('../../models/SystemAdmin'); // Path to your model file

router.post('/updateDeliveryFee', async (req, res) => {
    const newFee = req.body.fee;

    try {
        // Find the SystemAdmin document and update it
        const admin = await SystemAdmin.findOneAndUpdate({}, { deliveryFee: newFee }, { new: true, upsert: true });

        res.status(200).send({ message: 'Delivery fee updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating delivery fee' });
    }
});

router.post('/updateServiceFee', async (req, res) => {
    const newFee = req.body.fee;

    try {
        // Find the SystemAdmin document and update it
        const admin = await SystemAdmin.findOneAndUpdate({}, { serviceFee: newFee }, { new: true, upsert: true });

        res.status(200).send({ message: 'Service fee updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating Service fee' });
    }
});

router.get('/getDeliveryFee', async (req, res) => {
    try {
        // Find the SystemAdmin document
        const admin = await SystemAdmin.findOne();

        // If no SystemAdmin document exists, return an error
        if (!admin) {
            return res.status(404).send({ message: 'No SystemAdmin document found' });
        }

        // Send the deliveryFee as the response
        res.send({ fee: admin.deliveryFee });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching delivery fee' });
    }
});

router.get('/getServiceFee', async (req, res) => {
    try {
        // Find the SystemAdmin document
        const admin = await SystemAdmin.findOne();

        // If no SystemAdmin document exists, return an error
        if (!admin) {
            return res.status(404).send({ message: 'No SystemAdmin document found' });
        }

        // Send the serviceFee as the response
        res.send({ fee: admin.serviceFee });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching service fee' });
    }
});

module.exports = router;