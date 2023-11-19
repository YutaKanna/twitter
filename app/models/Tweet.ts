// models/Tweet.ts
import mongoose, { Document, Schema } from 'mongoose';

interface ITweet extends Document {
  name: string;
  description: string;
  // 他のフィールドを追加することもできます
}

const TweetSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.models.Tweet || mongoose.model<ITweet>('Tweet', TweetSchema);
