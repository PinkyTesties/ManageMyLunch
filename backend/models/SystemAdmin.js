//SystemAdmin.js

/*
This is the System Admin database Model for Mongo.
Where we store system information:
deliveryFee, serviceFee

Tyler Costa 19075541

*/
const mongoose = require('mongoose');

const SystemAdminSchema = new mongoose.Schema({
    deliveryFee: {
        type: Number,
        default: 0
    },
    serviceFee: {
        type: Number,
        default: 0
    },
});

const SystemAdmin = mongoose.model('SystemAdmin', SystemAdminSchema);
module.exports = SystemAdmin;