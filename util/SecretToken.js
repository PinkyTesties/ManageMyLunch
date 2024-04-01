
// This file is used to create a secret token for the user. This token is used to authenticate the user.

require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = createSecretToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};

