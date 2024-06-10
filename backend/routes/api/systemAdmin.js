//systemAdmin.js
/*
This is the route that handles the system admin functions.
It is used to update the delivery fee and service fee.

Created by Tyler Costa 19075541
*/
const express = require('express');
const router = express.Router();
const SystemAdmin = require('../../models/SystemAdmin'); 

// @route   POST api/systemAdmin/updateDeliveryFee
// @desc    Update the delivery fee
// @access  Public
router.post('/updateDeliveryFee', async (req, res) => {
    const newFee = req.body.fee;

    try {
        const admin = await SystemAdmin.findOneAndUpdate({}, { deliveryFee: newFee }, { new: true, upsert: true });

        res.status(200).send({ message: 'Delivery fee updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating delivery fee' });
    }
});

// @route   POST api/systemAdmin/updateServiceFee
// @desc    Update the service fee
// @access  Public
router.post('/updateServiceFee', async (req, res) => {
    const newFee = req.body.fee;

    try {
        //literally identical to the delivery fee update
        const admin = await SystemAdmin.findOneAndUpdate({}, { serviceFee: newFee }, { new: true, upsert: true });

        res.status(200).send({ message: 'Service fee updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating Service fee' });
    }
});

// @route   GET api/systemAdmin/getDeliveryFee
// @desc    Get the delivery fee
// @access  Public
router.get('/getDeliveryFee', async (req, res) => {
    try {
        const admin = await SystemAdmin.findOne();

        res.send({ fee: admin.deliveryFee });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching delivery fee' });
    }
});

// @route   GET api/systemAdmin/getServiceFee
// @desc    Get the service fee
// @access  Public
router.get('/getServiceFee', async (req, res) => {
    try {
        const admin = await SystemAdmin.findOne();

        res.send({ fee: admin.serviceFee });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching service fee' });
    }
});

module.exports = router;