// models/timetableModel.js
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
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
    fileUrl: { 
        type: String, 
        required: true 
    }, // URL or path of the uploaded PDF
    uploadedAt: { 
        type: Date, 
        default: Date.now 
    }, // Timestamp of when the file was uploaded
    // You can add more fields if necessary, e.g., subject, semester, etc.
});

const TimetableModel = mongoose.model('Timetable', timetableSchema);
module.exports = TimetableModel;
