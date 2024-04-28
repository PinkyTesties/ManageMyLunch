// models/Code.js
const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid four-digit code!`
    },
  },
});

module.exports = mongoose.model('Code', CodeSchema);