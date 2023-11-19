import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

mongoose.connect(process.env.MONGODB_URI);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();

  const token = jwt.sign({ userId: user._id, userName: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  res.status(201).send({ token });
};