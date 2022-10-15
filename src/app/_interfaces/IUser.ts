import {STATUS} from "../_enums/STATUS";

export interface IUser {
  id: string
  name: string,
  lastName: string,
  email: string,
  password: string,
  status: STATUS
}
