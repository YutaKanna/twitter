// models/Follow.ts
import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
  follower_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followee_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
}, {
  timestamps: true,
  // ドキュメントが作成されたときにタイムスタンプを生成します
});


// 同じフォロワーとフォローされているユーザーのペアがユニークであることを保証します
followSchema.index({ follower_id: 1, followee_id: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

export default Follow;
