// models/Item.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IItem extends Document {
  name: string;
  description: string;
  // 他のフィールドを追加することもできます
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
