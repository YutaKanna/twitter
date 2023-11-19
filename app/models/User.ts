import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    return next(error);
  }
  
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);
