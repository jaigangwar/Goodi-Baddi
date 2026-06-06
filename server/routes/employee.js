const express = require('express');
const Employee = require('../models/Employee');
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/search', protect, async (req, res) => {
  try {
    const { name, mobile, email, linkedin } = req.query;
    let query = {};
    if (name) query.employeeName = { $regex: name, $options: 'i' };
    if (mobile) query.mobile = mobile;
    if (email) query.email = { $regex: email, $options: 'i' };
    if (linkedin) query.linkedinUrl = { $regex: linkedin, $options: 'i' };

    const employees = await Employee.find(query);
    
    // Map to the format expected by frontend
    const results = employees.map(e => ({
      id: e._id,
      employeeName: e.employeeName,
      companyName: e.companyName,
      email: e.email,
      mobile: e.mobile,
      designation: e.designation,
      rating: e.rating
    }));
    
    res.json({ success: true, results, count: results.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    const feedbacks = await Feedback.find({ employeeId: employee._id });
    
    res.json({
      success: true,
      employee: {
        id: employee._id,
        ...employee._doc,
        feedbacks: feedbacks.map(f => ({
          id: f._id, ...f._doc
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const newEmployee = new Employee({
      ...req.body,
      companyId: req.company._id,
      companyName: req.company.companyName
    });
    const created = await newEmployee.save();
    res.status(201).json({ success: true, employeeId: created._id, message: 'Employee record created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
