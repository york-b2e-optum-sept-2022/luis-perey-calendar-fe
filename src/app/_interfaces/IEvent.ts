import {IUser} from "./IUser";

export interface IEvent {
  id: string
  owner_id: string
  name: string
  date: Date
  invites : {
    invite: IUser,
    status: boolean
  }[]
}
