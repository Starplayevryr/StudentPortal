const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    ref: 'Student', // Refers to the 'Student' model by registrationNumber
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['Sick Leave', 'Casual Leave', 'Emergency Leave', 'Other'], // Leave types
  },
  reason: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt timestamp before saving
leaveSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const LeaveRequestModel = mongoose.model('LeaveRequest', leaveSchema);

module.exports = LeaveRequestModel;
