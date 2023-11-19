// pages/api/tweets/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Tweet from '../../../models/Tweet';
import { jwtDecode } from "jwt-decode";
import Follow from '../../../models/Follow';

if (!mongoose.connection.readyState) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Environment variable MONGODB_URI is not set');
  }
  mongoose.connect(mongoUri);
}

interface CustomJwtPayload {
  userId?: string; // カスタムフィールドとしてuserIdを追加
}

const getFollowingIds = async (userId: string): Promise<string[]> => {
  try {
      // ログインユーザーがフォローしているユーザーのIDリストを取得
      const follows = await Follow.find({ follower_id: userId }).exec();
      return follows.map(follow => follow.followee_id.toString());
  } catch (error) {
      console.error('Error getting following IDs:', error);
      throw error; // エラーが発生した場合には例外をスロー
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        // トークンは通常、リクエストヘッダーのAuthorizationフィールドから取得します
        const token = req.headers.authorization?.split(' ')[1]; // Bearerトークンの想定
        console.log("token");
        if (!token) {
          return res.status(401).json({ message: "Authentication token is missing" });
        }

        const decoded = jwtDecode<CustomJwtPayload>(token);
        const userId = decoded.userId;
        if (!userId) {
          return res.status(401).json({ message: "Invalid token" });
        }
        console.log("userId", userId);

        // ユーザーIDを使用してフォローしているユーザーのIDを取得
        const followingIds = await getFollowingIds(userId);
        console.log("followingIds", followingIds);

        const authorIds = [userId, ...followingIds];
        const tweets = await Tweet.find({ user_id: { $in: authorIds } }).exec();

        console.log("tweets", tweets)

        res.status(200).json(tweets);
      } catch (error) {
        if (error instanceof Error) {
          // error が Error オブジェクトの場合、message プロパティにアクセスする
          res.status(500).json({ message: "Server error", error: error.message });
        } else {
          // error が Error オブジェクトでない場合
          res.status(500).json({ message: "Server error", error: "Unknown error" });
        }
      }
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
