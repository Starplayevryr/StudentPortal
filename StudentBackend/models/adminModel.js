const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number'],
  },
  address: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String, // Path or URL to the profile photo
    default: 'default-profile.png', // Default profile photo
  },
  adminLevel: {
    type: String,
    enum: ['basic', 'superadmin'],
    default: 'basic', // Defaults to basic admin level
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification', // Reference to the Notification model
    },
  ],
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

// Export the Admin model
module.exports = mongoose.model('Admin', AdminSchema);
