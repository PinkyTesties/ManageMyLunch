//Users.js

/*
This is the User database Model for Mongo.
Where we store & access user account information:
firstname, lastname, email, password, date_added, university, updated_date

*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
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
  }
});

module.exports = User = mongoose.model('user', UserSchema);