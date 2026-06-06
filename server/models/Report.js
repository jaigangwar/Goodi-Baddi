const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ['Employee', 'Feedback', 'Company'], required: true },
  reason: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Pending', 'Resolved', 'Dismissed'], default: 'Pending' },
  resolution: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
