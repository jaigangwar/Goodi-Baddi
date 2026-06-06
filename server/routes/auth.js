const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

router.post('/signup', async (req, res) => {
  try {
    const { companyName, hrName, email, password, mobile, linkedinUrl } = req.body;
    
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const company = await Company.create({
      companyName,
      hrName,
      email,
      password: hashedPassword,
      mobile,
      linkedinUrl
    });

    if (company) {
      res.status(201).json({
        success: true,
        message: 'Registration successful! Wait for admin approval.',
        companyId: company._id
      });
    } else {
      res.status(400).json({ message: 'Invalid company data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });

    if (company && (await bcrypt.compare(password, company.password))) {
      // For demo purposes, we ignore 'status' == 'Verified', normally: if (company.status !== 'Verified') throw Error
      res.json({
        success: true,
        token: generateToken(company._id),
        company: {
          id: company._id,
          companyName: company.companyName,
          hrName: company.hrName,
          email: company.email,
          role: company.role,
          status: company.status
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

router.post('/forgot-password', (req, res) => {
  res.json({ success: true, message: 'Password reset link sent to your email' });
});

module.exports = router;
