const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  class: {
    type: String,
    required: true,
    enum: [
      '1st sem',
      '2nd sem',
      '3rd sem',
      '4th sem',
      '5th sem',
      '6th sem',
      '7th sem',
      '8th sem',
    ], // Enum options for class
  },
  age: {
    type: Number,
    required: true,
  },
  phno: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student',
  },
  photo: {
    type: String, // Store the path of the uploaded photo
    default: 'uploads/default-photo.jpg',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Reference to the UserModel
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
  },
});

// Middleware to update the updatedAt timestamp before saving
studentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Student model
const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;
