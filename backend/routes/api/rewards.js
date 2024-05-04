//rewards.js
const express = require('express');
const router = express.Router();
const Reward = require('../../models/reward');

router.post('/create', async (req, res) => {
    const { title, points, dollarValue, message, code, rewardType, rewardStatus } = req.body;

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

router.get('/active', async (req, res) => {
    try {
        const rewards = await Reward.find({ rewardStatus: 'Active' });
        res.status(200).send(rewards);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;