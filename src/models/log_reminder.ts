import { Schema, model, Document } from 'mongoose';
import { ILogReminder } from '../interfaces/log_reminder';

const LogReminderSchema = new Schema({
  accunt: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  content: String,
}, {
  timestamps: true,
});

const LogReminder = model<ILogReminder & Document>('Lo', LogReminderSchema);

export default LogReminder;
