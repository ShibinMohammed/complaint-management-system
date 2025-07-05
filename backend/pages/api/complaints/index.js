import dbConnect from '../../../lib/dbConnect';
import Complaint from '../../../lib/models/Complaint';
import { sendNewComplaintEmail } from '../../../lib/email';
import cors, { runMiddleware } from '../../../middleware/cors';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { status, priority } = req.query; // Get status and priority from query parameters
        let filter = {};

        if (status) {
          filter.status = status;
        }
        if (priority) {
          filter.priority = priority;
        }

        const complaints = await Complaint.find(filter);
        res.status(200).json({ success: true, data: complaints });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case 'POST':
      try {
        const { title, description, category, priority } = req.body;

        if (!title || !description || !category || !priority) {
          return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        const complaint = await Complaint.create({
          title,
          description,
          category,
          priority,
        });
        res.status(201).json({ success: true, data: complaint });
        sendNewComplaintEmail(complaint);
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
      break;
  }
}