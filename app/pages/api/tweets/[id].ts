// pages/api/tweets/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Tweet from '../../../models/Tweet';

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      // 単一のアイテムを取得
      try {
        const tweet = await Tweet.findById(id);
        if (!tweet) return res.status(404).json({ message: "Tweet not found" });
        res.status(200).json(tweet);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving tweet" });
      }
      break;
    case 'PUT':
      // アイテムを更新
      try {
        const updatedTweet = await Tweet.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTweet) return res.status(404).json({ message: "Tweet not found" });
        res.status(200).json(updatedTweet);
      } catch (error) {
        res.status(500).json({ message: "Error updating tweet" });
      }
      break;
    case 'DELETE':
      // アイテムを削除
      try {
        const deletedTweet = await Tweet.findByIdAndDelete(id);
        if (!deletedTweet) return res.status(404).json({ message: "Tweet not found" });
        res.status(200).json({ message: "Tweet deleted" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting tweet" });
      }
      break;
    default:
      res.status(400).json({ message: "Method not allowed" });
  }
}
