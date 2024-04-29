// authController.js

const User = require('../models/Users');
const { CreateSecretToken } = require('../util/SecretToken');
const bcrypt = require('bcryptjs');

// Signup controller
module.exports.Signup = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword, university, createdAt } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ name, email, password, confirmPassword, university, createdAt });
        const token = CreateSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ message: "User signed up successfully", success: true, user });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

