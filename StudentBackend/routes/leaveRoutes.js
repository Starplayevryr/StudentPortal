const express = require('express');
const router = express.Router();
const LeaveRequestModel = require('../models/leaveModel');

// Apply for leave
router.post('/', async (req, res) => {
  const { registrationNumber, leaveType, reason, startDate, endDate } = req.body;

  try {
    // Validate input data
    if (!registrationNumber || !leaveType || !reason || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newLeaveRequest = new LeaveRequestModel({
      registrationNumber,  // Use registrationNumber instead of studentId
      leaveType,
      reason,
      startDate,
      endDate,
    });

    const savedLeaveRequest = await newLeaveRequest.save();
    res.status(200).json({ message: 'Leave request submitted successfully', leave: savedLeaveRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving leave request' });
  }
});

// Get all leaves for a student by registrationNumber
router.get('/leave/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    const leaves = await LeaveRequestModel.find({ registrationNumber });
    res.status(200).json({ leaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching leave requests' });
  }
});

// Admin - Approve/Reject leave request
router.put('/leave/:leaveId', async (req, res) => {
  const { leaveId } = req.params;
  const { status } = req.body; // Status will be 'Approved' or 'Rejected'

  try {
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedLeave = await LeaveRequestModel.findByIdAndUpdate(leaveId, { status }, { new: true });
    if (!updatedLeave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.status(200).json({ message: 'Leave status updated', leave: updatedLeave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating leave status' });
  }
});

// Get all leave requests (Admin view)
router.get('/leave', async (req, res) => {
  try {
    const leaves = await LeaveRequestModel.find();
    
    res.status(200).json({ leaves});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching leave requests' });
  }
});
router.get('/Count1', async (req, res) => {
  try {
    const pendingCount = await LeaveRequestModel.countDocuments({ status: 'Pending' });
    res.status(200).json({ pendingLeaveCount: pendingCount });
  } catch (error) {
    console.error('Error fetching pending leave requests:', error);
    res.status(500).json({ error: 'Error fetching pending leave requests' });
  }
});

module.exports = router;

