// models/Tweet.ts
import mongoose, { Document, Schema } from 'mongoose';

interface ITweet extends Document {
  _id: string;
  name: string;
  description: string;
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
}

const TweetSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});

export default mongoose.models.Tweet || mongoose.model<ITweet>('Tweet', TweetSchema);
