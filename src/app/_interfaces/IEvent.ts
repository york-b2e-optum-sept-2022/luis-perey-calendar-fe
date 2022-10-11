import {IUser} from "./IUser";

export interface IEvent {
  id: string
  ownerId: IUser
  name: string
  description: string
  date: Date
  time: TimeRanges
  place: string
  address: string
  duration: number
  invitees : [
    invite: IUser
  ]
}
