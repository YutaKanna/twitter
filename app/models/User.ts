import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    if (typeof this.password === 'string') {
      this.password = await bcrypt.hash(this.password, 10);
    } else {
      // パスワードがstring型でない場合のエラーハンドリング
      throw new Error('Password must be a string');
    }
  } catch (error) {
    return next(error);
  }

  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);
