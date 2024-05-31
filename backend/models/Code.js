// models/Code.js
/*
This is the Code.js file

This is the setup for the Code database model. It is used to store the four-digit code that is sent to the user's email for verification.

Tyler Costa 19075541
*/

const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Code", CodeSchema);
