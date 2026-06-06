const express = require('express');
const Company = require('../models/Company');
const Report = require('../models/Report');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/companies', protect, admin, async (req, res) => {
  try {
    const companies = await Company.find({ role: { $ne: 'Admin' } }).select('-password');
    res.json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/companies/:id/verify', protect, admin, async (req, res) => {
  try {
    const { action } = req.body;
    const status = action === 'approve' ? 'Verified' : 'Rejected';
    
    await Company.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true, message: `Company ${status.toLowerCase()} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/reports', protect, admin, async (req, res) => {
  try {
    const reports = await Report.find();
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
