const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel'); // Adjust the path to your User model
const StudentModel = require('../models/studentmodel'); 
const NotificationModel = require('../models/notificationstud');
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');
const path= require('path')
const TimetableModel = require('../models/examtimetable')

// Controller to get total number of students
router.get('/count', async (req, res) => {
  try {
    console.log("students hit");
    const totalStudents = await UserModel.countDocuments({ role: 'student' }); // Count students only
    res.status(200).json({ total: totalStudents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student data', error });
  }
});

// Route to create a new student
router.post('/students', upload.single('photo'), async (req, res) => {
  try {
    const { registrationNumber, firstName, lastName, email, class: studentClass, age, phno, address } = req.body;

    // Find the user by registrationNumber or email
    const user = await UserModel.findOne({
      $or: [{ registrationNumber }, { email }],
    });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this registration number or email' });
    }

    // Ensure the photo path has forward slashes (for cross-platform consistency)
    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : 'uploads/default-photo.jpg';

    // Create a new student object and link it to the user via userId
    const newStudent = new StudentModel({
      registrationNumber,
      firstName,
      lastName,
      email,
      class: studentClass,
      age,
      phno,
      address,
      photo: imagePath,
      userId: user._id, // Link the user model
    });

    // Save the student record to the database
    const savedStudent = await newStudent.save();

    // Send success response
    res.status(201).json({ message: 'Student created successfully', student: savedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating student', error });
  }
});


router.delete('/students/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    const student = await StudentModel.findOneAndDelete({ registrationNumber });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
});

// Route to get a specific student by ID
router.get('/students/:id', async (req, res) => {
  try {
    // Find the student by ID and populate the linked user
    const student = await StudentModel.findById(req.params.id).populate('userId', 'username email role');
  
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
  
    // Send the student details along with linked user info
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching student', error });
  }
});

// Route to get all students with linked user details
router.get('/students', async (req, res) => {
  try {
    // Populate user details using userId
    const students = await StudentModel.find().populate('userId', 'registrationNumber username email role');
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

// Route to create a new notification
router.post('/notifications', authMiddleware, async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized. User ID is missing.' });
  }

  try {
    const { title, message, class: studentClass, type, scheduleDate } = req.body;

    // Ensure scheduleDate is provided
    if (!scheduleDate) {
      return res.status(400).json({ message: 'scheduleDate is required.' });
    }

    const newNotification = new NotificationModel({
      title,
      message,
      class: studentClass,
      type,
      sentBy: req.user._id, 
      scheduleDate // Ensure user is authenticated
    });

    const savedNotification = await newNotification.save();
    res.status(201).json({ message: 'Notification sent successfully', notification: savedNotification });
  } catch (error) {
    console.error('Error sending notification:', error); // Log the error to see more details in the server
    res.status(500).json({ message: 'Error sending notification', error: error.message || error });
  }
});


// Route to get all notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await NotificationModel.find().sort({ dateSent: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

// Route to get a specific notification by ID
router.get('/notifications/:id', async (req, res) => {
  try {
    const notification = await NotificationModel.findById(req.params.id).populate('sentBy', 'username email');
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ message: 'Error fetching notification', error });
  }
});



router.put('/notifications/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID
  const notificationData = req.body; // Extract the data

  console.log('Updating notification with ID:', id);

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
  }

  // Validate required fields
  if (!notificationData.title || !notificationData.message) {
      return res.status(400).json({ message: 'Title and message are required.' });
  }

  try {
      const updatedNotification = await NotificationModel.findOneAndUpdate(
          { _id: id },
          notificationData,
          { new: true }
      );

      if (!updatedNotification) {
          return res.status(404).json({ message: 'Notification not found' });
      }
      res.status(200).json(updatedNotification);
  } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({ message: 'Error updating notification' });
  }
});

// Route to delete a notification
router.delete('/notifications/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNotification = await NotificationModel.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification', error });
  }
});





// Upload timetable
router.post('/upload-timetable', upload.single('file'), async (req, res) => {
    try {
        const { class: className } = req.body;

        // Construct the full file URL
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Save timetable entry in the database
        const newTimetable = new TimetableModel({
            class: className,
            fileUrl: fileUrl,
            uploadedAt: Date.now(),
        });

        await newTimetable.save();

        res.status(200).json({
            message: "File uploaded successfully!",
            class: className,
            fileUrl: fileUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred during file upload." });
    }
});

// Get timetable (by class or all)
router.get('/get-timetable', async (req, res) => {
    try {
        const { class: className } = req.query;

        let timetables;
        if (className) {
            timetables = await TimetableModel.find({ class: className });
        } else {
            timetables = await TimetableModel.find();
        }

        if (!timetables.length) {
            return res.status(404).json({ message: "No timetables found" });
        }

        res.status(200).json({
            message: "Timetables fetched successfully",
            timetables: timetables,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching timetables." });
    }
});

// GET timetables for a specific class
router.get('/timetables/:class', async (req, res) => {
  const { class: className } = req.params; // Get class from request parameters

  try {
      // Find timetables that match the specified class
      const timetables = await TimetableModel.find({ class: className });

      // If no timetables found, return a 404 status
      if (!timetables.length) {
          return res.status(404).json({ message: 'No timetables found for this class.' });
      }

      // Return the found timetables
      res.status(200).json(timetables);
  } catch (error) {
      // Handle any errors during the database query
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
