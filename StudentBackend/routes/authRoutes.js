const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust the path as necessary

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    try {
        const { registrationNumber, username, password, email, role, phno, firstName, lastName } = req.body;

        if (!registrationNumber || !username || !password || !email || !role || !phno || !firstName || !lastName) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send({ message: "Email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ registrationNumber, username, password: hashedPassword, email, role, phno, firstName, lastName });
        const result = await user.save();
        const token = jwt.sign({ _id: result._id }, "default_secret_key", { expiresIn: '1d' });

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).send({ message: "Registration successful" });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).send({ message: "Validation error: " + error.message });
        }
        if (error.code === 11000) {
            return res.status(400).send({ message: "Email is already registered" });
        }
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});  const mongoose = require('mongoose');




// Login function
router.post('/login', async (req, res) => {
    console.log('Login route hit'); 
    try {
        const { registrationNumber, email, password, role } = req.body;

        // Validate required fields
        if (!email || !registrationNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user by registration number and email
        const user = await User.findOne({ registrationNumber, email });

        // If user not found, return error
        if (!user) {
            return res.status(401).json({ message: "Invalid Registration number or email" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Check if the provided role matches the user's role
        if (user.role !== role) {
            return res.status(403).json({ message: 'Role does not match' });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || "default_secret_key", { expiresIn: '1d' });

        // Set cookie with the token
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Successful login response
        res.status(200).send({
            message: "Login successful",
            token: token,
            user: { email: user.email, role: user.role,username: user.username   ,registrationNumber: user.registrationNumber         }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});

// Export the router
module.exports = router;
