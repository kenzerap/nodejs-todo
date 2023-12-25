const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'active',
  },
});

module.exports = mongoose.model('User', userSchema);
