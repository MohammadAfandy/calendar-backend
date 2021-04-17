import { Schema, model, Document } from 'mongoose';
import { IUser } from '../interfaces/user';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  authType: String,
  authId: String,
  email: {
    type: String,
    required: true
  },
  phoneNumber: String,
  telegramAccount: {
    username: String,
    chatId: String,
  },
  whatsappNotification: Boolean,
  telegramNotification: Boolean,
}, {
  timestamps: true,
});

const User = model<IUser & Document>('user', UserSchema);

export default User;
