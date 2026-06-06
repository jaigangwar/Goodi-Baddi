const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  hrName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  linkedinUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  role: { type: String, enum: ['Company', 'Admin'], default: 'Company' }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
