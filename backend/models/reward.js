//reward.js
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