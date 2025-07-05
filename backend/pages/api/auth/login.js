import dbConnect from '../../../lib/dbConnect';
import User from '../../../lib/models/User';
import generateToken from '../../../lib/utils/generateToken';
import cors, { runMiddleware } from '../../../middleware/cors';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          username: user.username,
          isAdmin: user.isAdmin, // Include isAdmin in the response
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}