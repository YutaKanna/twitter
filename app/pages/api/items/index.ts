// pages/api/items/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Item from '../../../models/Item';

mongoose.connect(process.env.MONGODB_URI);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // アイテムのリストを取得
      const items = await Item.find();
      res.status(200).json(items);
      break;
    case 'POST':
      // 新しいアイテムを作成
      const newItem = new Item(req.body);
      await newItem.save();
      res.status(201).json(newItem);
      break;
    default:
      res.status(400).json({ message: "Method not allowed" });
  }
}
