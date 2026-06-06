const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  linkedinUrl: { type: String },
  designation: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  leavingDate: { type: Date },
  reasonForLeaving: { type: String },
  employmentType: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String, required: true },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
