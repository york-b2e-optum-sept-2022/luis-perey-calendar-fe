import {IUser} from "./IUser";

export interface IEvent {
  id: string
  ownerId: IUser
  name: string
  date: Date
  invitees : [
    invite: IUser
  ]
}
