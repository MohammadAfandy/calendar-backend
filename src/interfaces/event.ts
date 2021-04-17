import { IUser } from './user';

export interface IEvent {
  _id?: string
  name: string
  detail: string
  tags: string[]
  startDate: Date
  endDate: Date
  color: string
  user?: string | IUser
}
