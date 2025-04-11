// src/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    countryCode: {
      type: String
    },
    number: {
      type: String
    }
  },
  userType: {
    type: String,
    enum: ['Patient', 'Doctor', 'Other'],
    default: 'Patient'
  },
  age: {
    type: Number
  },
  profileCreated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);