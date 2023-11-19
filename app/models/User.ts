import mongoose, { CallbackError } from 'mongoose';
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
      throw new Error('Password must be a string');
    }
  } catch (error) {
    // 'error' を 'CallbackError' として扱う
    return next(error as CallbackError);
  }

  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);
