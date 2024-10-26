const express = require('express');
const router = express.Router();
const NotificationModel = require('../models/notificationstud'); // Assuming your Notification model is in the models folder
const StudentModel = require('../models/studentmodel')
const LeaveRequestModel = require('../models/leaveModel');
// Route to get notifications for a specific month and year

router.get('/notify', async (req, res) => {
  console.log('Received request for all notifications');

  try {
      const notifications = await NotificationModel.find(); // Fetch all notifications

      res.json(notifications);
  } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

      
  router.get('/student-details', async (req, res) => {
    const registrationNumber = req.query.registrationNumber;
    console.log("Received registration number:", registrationNumber);  // Get the registration number from query params
  
   

    try {
      const student = await StudentModel.findOne({ registrationNumber }); // Find student by registration number
  
      if (!student) {
        return res.status(404).send({ message: "Student not found" });
      }
  
      res.status(200).send(student); // Send the student details in the response
    } catch (error) {
      console.error('Error fetching student details:', error);
      res.status(500).send({ message: "Server error" });
    }
  });

 




module.exports = router;
