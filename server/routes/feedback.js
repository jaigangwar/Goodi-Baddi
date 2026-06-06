const express = require('express');
const Feedback = require('../models/Feedback');
const Employee = require('../models/Employee');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { employeeId, rating, positives, negatives, comments } = req.body;
    
    const newFeedback = new Feedback({
      employeeId,
      companyId: req.company._id,
      companyName: req.company.companyName,
      rating,
      positives,
      negatives,
      comments
    });
    
    const created = await newFeedback.save();
    
    // Update overall rating for employee
    const allFeedbacks = await Feedback.find({ employeeId });
    const avgRating = allFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / allFeedbacks.length;
    
    await Employee.findByIdAndUpdate(employeeId, { rating: avgRating });
    
    res.status(201).json({ success: true, feedbackId: created._id, message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/employee/:employeeId', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ employeeId: req.params.employeeId });
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
