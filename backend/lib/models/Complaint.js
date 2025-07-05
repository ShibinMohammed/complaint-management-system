import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Product', 'Service', 'Support'] },
  priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
  status: { type: String, default: 'Pending', enum: ['Pending', 'In Progress', 'Resolved'] },
  dateSubmitted: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);