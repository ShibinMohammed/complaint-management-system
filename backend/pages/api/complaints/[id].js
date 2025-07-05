import dbConnect from '../../../lib/dbConnect';
import Complaint from '../../../lib/models/Complaint';
import { sendNewComplaintEmail, sendStatusUpdateEmail } from '../../../lib/email';
import cors, { runMiddleware } from '../../../middleware/cors';
import { protect } from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  await dbConnect();

  const { query: { id }, method } = req;

  switch (method) {
    case 'GET':
      try {
        const complaint = await Complaint.findById(id);
        if (!complaint) {
          return res.status(404).json({ success: false, message: 'Complaint not found' });
        }
        res.status(200).json({ success: true, data: complaint });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case 'PUT':
      await runMiddleware(req, res, protect);
      if (res.statusCode === 401) return; // If not authorized, stop here
      try {
        const oldComplaint = await Complaint.findById(id);
        if (!oldComplaint) {
          return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        const complaint = await Complaint.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!complaint) {
          return res.status(404).json({ success: false, message: 'Complaint not found' });
        }
        res.status(200).json({ success: true, data: complaint });
        if (req.body.status && req.body.status !== oldComplaint.status) {
          sendStatusUpdateEmail(complaint, oldComplaint.status);
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case 'DELETE':
      await runMiddleware(req, res, protect);
      if (res.statusCode === 401) return; // If not authorized, stop here
      try {
        const deletedComplaint = await Complaint.deleteOne({ _id: id });
        if (!deletedComplaint.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Complaint not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
      break;
  }
}