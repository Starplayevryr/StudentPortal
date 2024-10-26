const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student',
    },
    phno: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
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
});

// Middleware to update the updatedAt timestamp
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the User model from the schema
const UserModel = mongoose.model('User', userSchema);

// Export the model
module.exports = UserModel;
