// pages/api/tweets/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Tweet from '../../../models/Tweet';

mongoose.connect(process.env.MONGODB_URI);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // アイテムのリストを取得
      const tweets = await Tweet.find();
      res.status(200).json(tweets);
      break;
    case 'POST':
      // 新しいアイテムを作成
      const newTweet = new Tweet(req.body);
      await newTweet.save();
      res.status(201).json(newTweet);
      break;
    default:
      res.status(400).json({ message: "Method not allowed" });
  }
}
