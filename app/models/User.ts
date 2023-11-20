import mongoose, { CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.pre<IUser>('save', async function (next) {
  // 'this.isModified' は mongoose.Document に含まれているため、
  // IUser インターフェースから 'isModified' を削除しても使用できます。
  if (!this.isModified('password')) return next();

  try {
    if (typeof this.password === 'string') {
      this.password = await bcrypt.hash(this.password, 10);
    } else {
      throw new Error('Password must be a string');
    }
  } catch (error) {
    return next(error as CallbackError);
  }

  next();
});

export default mongoose.model<IUser>('User', userSchema);
