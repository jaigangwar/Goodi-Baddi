const express = require('express');
const Company = require('../models/Company');
const Employee = require('../models/Employee');
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ companyId: req.company._id });
    const totalFeedbacks = await Feedback.countDocuments({ companyId: req.company._id });
    
    res.json({
      success: true,
      stats: {
        totalEmployees,
        totalFeedbacks,
        recentSearches: 0 // Mock value
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.company._id).select('-password');
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
