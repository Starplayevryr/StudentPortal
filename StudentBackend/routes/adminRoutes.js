const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel'); // Import the Admin model
const path = require('path');
const upload = require('../middlewares/upload');

// POST route for creating a new admin
router.post('/profile', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { registrationNumber, email, phone, address, adminLevel } = req.body;

    // Fetch user based on registration number
    const user = await User.findOne({ registrationNumber }); // Adjust according to your user model

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please check the registration number.' });
    }

    // Get the uploaded image path or default image path
    const profilePhoto = req.file ? req.file.path.replace(/\\/g, '/') : 'uploads/default-photo.jpg';

    // Create a new Admin object
    const newAdmin = new Admin({
      user: user._id, // Use the found user's ID
      registrationNumber,
      email,
      phone,
      address,
      profilePhoto, // Use the uploaded file path or default
      adminLevel
    });

    // Save the new admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create admin', details: err.message });
  }
});


// GET route for fetching a specific admin by registrationNumber
router.get('/profile/:registrationNumber', async (req, res) => {
    try {
      // Find admin by registrationNumber
      const admin = await Admin.findOne({ registrationNumber: req.params.registrationNumber }).populate('user').exec();
  
      // If no admin found
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Return the admin data if found
      res.status(200).json(admin);
    } catch (err) {
      // Handle errors
      res.status(500).json({ error: 'Failed to fetch admin', details: err.message });
    }
  });
  
  // PUT route to update admin profile using registrationNumber
  router.put('/profile/:registrationNumber', upload.single('profilePhoto'), async (req, res) => {
    try {
        const { registrationNumber, email, phone, address, adminLevel } = req.body;
        const regNumber = req.params.registrationNumber;

        // Find the admin by registration number
        const admin = await Admin.findOne({ registrationNumber: regNumber });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if a new profile photo is uploaded
        const profilePhoto = req.file ? req.file.path.replace(/\\/g, '/') : admin.profilePhoto;

        // Update the admin details
        admin.registrationNumber = registrationNumber || admin.registrationNumber;
        admin.email = email || admin.email;
        admin.phone = phone || admin.phone;
        admin.address = address || admin.address;
        admin.adminLevel = adminLevel || admin.adminLevel;
        admin.profilePhoto = profilePhoto;

        // Save the updated admin
        await admin.save();

        res.status(200).json({ message: 'Admin profile updated successfully', admin });
    } catch (err) {
        console.error('Failed to update admin profile:', err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to update admin profile', details: err.message });
    }
});


module.exports = router;
