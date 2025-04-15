// src/models/healthProfileModel.js
const mongoose = require('mongoose');

const healthProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    ref: 'User'
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
  },
  pastDiseases: [{
    type: String
  }],
  familyHistory: [{
    type: String
  }],
  medications: {
    type: String
  },
  allergies: {
    type: String
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

module.exports = mongoose.model('HealthProfile', healthProfileSchema);