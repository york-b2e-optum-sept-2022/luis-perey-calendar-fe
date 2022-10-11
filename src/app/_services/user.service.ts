import { Injectable } from '@angular/core';
import {first, Subject} from "rxjs";
import {v4 as uuid} from 'uuid';
import {ILoginForm} from "../_interfaces/ILoginForm";
import {ERROR} from "../_enums/ERROR";
import {IUser} from "../_interfaces/IUser";
import {HttpService} from "./http.service";
import {EventService} from "./event.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userAccount!: IUser
  allAccounts! : IUser[]
  $userOwner = new Subject<IUser>()
  $userAccount = new Subject<IUser>()
  $isRegistering = new Subject<boolean>()
  $message = new Subject<string>()
  $isLoggedIn = new Subject<boolean>()
  $accounts = new Subject<IUser[]>()

  constructor(private httpService: HttpService, private eventService: EventService) {

  }

  setRegistering(bool: boolean) {
    this.$isRegistering.next(bool)
  }

  getUserAccount(){
    return this.userAccount
  }

  getInvitees(){
    return this.allAccounts
  }

  getAllAccounts(){
    this.httpService.getAllAccounts().pipe(first()).subscribe({
      next:(accounts)=>{
        this.$accounts.next(accounts.filter(user => user.id !== this.userAccount.id))
        this.allAccounts = accounts.filter(user => user.id !== this.userAccount.id)
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

  getUserById(userId: string){
    this.httpService.getUserById(userId).pipe(first()).subscribe({
      next:(user)=>{
        this.$userOwner.next(user[0])
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

  onLogin(user: ILoginForm){
    const regPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if(!user.email.match(regPattern)){
      this.$message.next(ERROR.INVALID_EMAIL)
      return
    }
    this.httpService.getUserByEmail(user.email).pipe(first()).subscribe({
      next: (userData) => {
        if (userData.length === 0) {
          this.$message.next(ERROR.LOGIN_NOT_EXIST_EMAIL)
          return
        }
        const userOk = userData.find(us => (us.email === user.email) && (us.password === user.password) )
        if(!userOk){
          this.$message.next(ERROR.LOGIN_WRONG_PASSWORD)
          return
        }
        this.userAccount = userOk
        this.$userAccount.next(userOk)
        this.$isLoggedIn.next(true)
        this.eventService.getEventList(userOk.id)
      },
      error: (err) => {
        this.$message.next(ERROR.LOGIN_HTTP_ERROR)
        console.error(err);
      }
    })
  }

  onRegister(user: IUser, repeatPassword: string){
    const regPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (user.name.length === 0) {
      this.$message.next(ERROR.REGISTER_INVALID_NAME)
      return
    }
    if (user.lastName.length === 0) {
      this.$message.next(ERROR.REGISTER_INVALID_LAST_NAME)
      return
    }
    if (!user.email.match(regPattern)) {
      this.$message.next(ERROR.INVALID_EMAIL)
      return
    }
    if (user.password.length < 5) {
      this.$message.next(ERROR.REGISTER_INVALID_PASSWORD)
      return
    }
    if (user.password !== repeatPassword) {
      this.$message.next(ERROR.REGISTER_NO_MATCH_PASSWORD)
      return
    }
    user.id = uuid()
    this.httpService.getUserByEmail(user.email).pipe(first()).subscribe({
      next: (val) => {
        if (val.length > 0) {
          this.$message.next(ERROR.REGISTER_DUPLICATE_EMAIL)
          return
        }
        this.httpService.createUser(user).pipe(first()).subscribe({
          next: (user) => {
            this.$userAccount.next(user)
          },
          error: (err) => {
            this.$message.next(ERROR.REGISTER_HTTP_ERROR)
            console.error(err)
          }
        })
        this.eventService.getEventList(user.id)
        this.setRegistering(false)
      },
      error: (err)=>{
        this.$message.next(ERROR.REGISTER_HTTP_ERROR)
        console.error(err)
      }
    })
  }

  logout(){
    this.$isLoggedIn.next(false)
  }
}
