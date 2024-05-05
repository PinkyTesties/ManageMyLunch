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

router.get('/filter', async (req, res) => {
    const status = req.query.status;
    try {
        const rewards = status ? await Reward.find({ rewardStatus: status }) : await Reward.find();
        res.status(200).send(rewards);
    } catch (error) {
        res.status(500).send(error);
    }
});

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