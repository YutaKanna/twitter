import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../../models/User';

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI);
}

// ユーザー情報を取得するためのハンドラ
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // リストを取得
      const users = await User.find();
      res.status(200).json(users);
      break;
    default:
      res.status(400).json({ message: "Method not allowed" });
  }
}
