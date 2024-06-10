//SystemAdmin.js
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
    // Add other fields as necessary
});

const SystemAdmin = mongoose.model('SystemAdmin', SystemAdminSchema);
module.exports = SystemAdmin;