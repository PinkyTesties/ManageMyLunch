//reward.js

/*
This is the Reward database Model for Mongo.
Where we store & access reward information:
title, points, dollarValue, message, code, deliveryDiscount, freeDelivery, menuItemDiscount, rewardStatus

DeliveryDiscount, freeDelivery, menuItemDiscount are boolean values, only one can be true at a time.
This itdentifies it rewards type. ITs handled in Rewards.jsx by an admin.

Tyler Costa 19075541

*/
const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    dollarValue: {
        type: Number
    },
    message: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    deliveryDiscount: {
        type: Boolean,
        default: false
    },
    freeDelivery: {
        type: Boolean,
        default: false
    },
    menuItemDiscount: {
        type: Boolean,
        default: false
    },
    rewardStatus: {
        type: String
    }
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;