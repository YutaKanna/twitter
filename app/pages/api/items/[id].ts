// pages/api/items/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Item from '../../../models/Item';

mongoose.connect(process.env.MONGODB_URI);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      // 単一のアイテムを取得
      try {
        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.status(200).json(item);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving item" });
      }
      break;
    case 'PUT':
      // アイテムを更新
      try {
        const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        res.status(200).json(updatedItem);
      } catch (error) {
        res.status(500).json({ message: "Error updating item" });
      }
      break;
    case 'DELETE':
      // アイテムを削除
      try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        res.status(200).json({ message: "Item deleted" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting item" });
      }
      break;
    default:
      res.status(400).json({ message: "Method not allowed" });
  }
}
