const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  targetStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  class: {  
    type: String,
    enum: ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem','ALL'],  // List your classes here
    required: true
  },
  type: { 
    type: String, 
    enum: ['general', 'event', 'assignment', 'remainder'], 
    default: 'general' 
  },
  dateSent: { type: Date, default: Date.now },  // Automatically sets the date when the notification is sent
  scheduleDate: { type: Date, required: true },  // Optional field for scheduling notifications
});

// Add an index on `scheduleDate` if you plan to fetch notifications based on the date
NotificationSchema.index({ scheduleDate: 1 });

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
