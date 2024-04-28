
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// This is the schema for the verification token
const verificationTokenSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // this is the expiry time in seconds
    }
});
// This is the pre-save hook that will hash the token before saving it to the database
verificationTokenSchema.pre('save', async function(next) {
    if(this.isModified('token')) {
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash;
    }
    next();
});
// This is the method that will be used to compare the token with the hashed token in the database
verificationTokenSchema.methods.compareToken = async function(token) {
    const result = await bcrypt.compareSync(token, this.token);
    return result;
};

module.exports = User = mongoose.model('VerificationToken', verificationTokenSchema);