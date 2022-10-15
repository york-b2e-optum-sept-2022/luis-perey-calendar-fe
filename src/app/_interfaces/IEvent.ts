import {IUser} from "./IUser";
import {STATUS} from "../_enums/STATUS";

export interface IEvent {
  id: string
  ownerId: IUser
  name: string
  description: string
  date: Date
  place: string
  address: string
  duration: number
  invitees : [
    invite: IUser
  ],
  status: STATUS
}
