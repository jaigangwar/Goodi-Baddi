const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  positives: [{ type: String }],
  negatives: [{ type: String }],
  comments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
