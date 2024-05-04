//Users.js

/*
This is the User database Model for Mongo.
Where we store & access user account information:
firstname, lastname, email, password, date_added, university, updated_date

*/
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  date_added: {
    type: Date,
    default: Date.now
  },
  university: {
    type: String
  },
  updated_date: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  rewardsPoints: {
    type: Number,
    default: 0
  },

});

module.exports = User = mongoose.model('user', UserSchema);