// pages/api/tweets/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Follow from '../../../models/Follow';

if (!mongoose.connection.readyState) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Environment variable MONGODB_URI is not set');
  }
  mongoose.connect(mongoUri);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // console.log("req.body", req.body);
    // const { follower_id, followee_id } = req.body;
    // console.log("follower_id", follower_id)
    // console.log("follower_id", followee_id)
    try {
      console.log("postできました")
      const { follower_id, followee_id } = req.body; // ここでリクエストボディから必要な値を取得
      console.log("follower_id", follower_id)
      console.log("follower_id", followee_id)
      const newFollow = new Follow({ follower_id, followee_id });
      await newFollow.save();
      res.status(201).json({ message: "フォロー関係が保存されました" });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        // error が Error オブジェクトの場合、message プロパティに安全にアクセスできます
        res.status(500).json({ message: "フォローの保存中にエラーが発生しました", error: error.message });
      } else {
        // error が Error オブジェクトではない場合のハンドリング
        res.status(500).json({ message: "フォローの保存中にエラーが発生しました", error: "未知のエラー" });
      }
    }
  } else {
    res.status(400).json({ message: "許可されていないメソッドです" });
  }
}
