import mongoose, { CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  isModified(path: string): boolean; // この行を追加
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    if (typeof this.password === 'string') {
      this.password = await bcrypt.hash(this.password, 10);
    } else {
      throw new Error('Password must be a string');
    }
  } catch (error) {
    // 'error' を 'CallbackError' として扱う
    return next(error as CallbackError);
  }

  next();
});

export default mongoose.model<IUser>('User', userSchema);
