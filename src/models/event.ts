import { Schema, model, Document } from 'mongoose';
import { IEvent } from '../interfaces/event';

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  detail: String,
  tags: [String],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  color: String,
  // _userId: Schema.Types.ObjectId,
  user: { type: Schema.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
});

const Event = model<IEvent & Document>('event', EventSchema);

export default Event;
