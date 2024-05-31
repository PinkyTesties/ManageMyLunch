//rewards.js
/*
This is rewards.js
It is the api code for the rewards. It is used to create, get, update and delete rewards.

Created by Tyler Costa 19075541

*/
const express = require('express');
const router = express.Router();
const Reward = require('../../models/reward');

// @route   POST api/rewards/create
// @desc    create a new reward
// @access  Public
router.post('/create', async (req, res) => {
    const { title, points, dollarValue, message, code, rewardType, rewardStatus } = req.body;
    // Create a new reward object with the data sent to the api
    const reward = new Reward({
        title,
        points,
        dollarValue,
        message,
        code,
        deliveryDiscount: rewardType === 'Delivery Discount',
        freeDelivery: rewardType === 'Free Delivery',
        menuItemDiscount: rewardType === 'Menu Item Discount',
        rewardStatus
    });

    try {
        await reward.save();
        res.status(201).send(reward);
    } catch (error) {
        res.status(400).send(error);
    }
});

// @route   GET api/reviewForm/active
// @desc    Get all rewards that are active
// @access  Public
router.get('/active', async (req, res) => {
    try {
        const rewards = await Reward.find({ rewardStatus: 'Active' });
        res.status(200).send(rewards);
    } catch (error) {
        res.status(500).send(error);
    }
});

// @route   GET api/reviewForm/filter
// @desc    Get all rewards that match the status sent to the api
// @access  Public
router.get('/filter', async (req, res) => {
    const status = req.query.status;
    try {
        const rewards = status ? await Reward.find({ rewardStatus: status }) : await Reward.find();
        res.status(200).send(rewards);
    } catch (error) {
        res.status(500).send(error);
    }
});

// @route   PUT api/reviewForm/update/:id
// @desc    update reward by id
// @access  Public
router.put('/update/:id', async (req, res) => {
    const { rewardStatus } = req.body;

    try {
        const reward = await Reward.findById(req.params.id);
        if (!reward) {
            return res.status(404).send({ message: 'Reward not found' });
        }

        reward.rewardStatus = rewardStatus;
        await reward.save();

        res.status(200).send(reward);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;