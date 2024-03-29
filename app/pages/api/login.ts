import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

if (!mongoose.connection.readyState) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Environment variable MONGODB_URI is not set');
  }
  mongoose.connect(mongoUri);
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id, userName: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  res.status(200).json({ token });
};

export default loginUser;
