import dbConnect from '../../../lib/dbConnect';
import User from '../../../lib/models/User';
import generateToken from '../../../lib/utils/generateToken';
import cors, { runMiddleware } from '../../../middleware/cors';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
      const userExists = await User.findOne({ username });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        username,
        password,
        isAdmin: false, // All new registrations are regular users
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}