import {Injectable} from '@angular/core';
import {BehaviorSubject, first, Subject} from "rxjs";
import {v4 as uuid} from 'uuid';
import {ILoginForm} from "../_interfaces/ILoginForm";
import {ERROR} from "../_enums/ERROR";
import {IUser} from "../_interfaces/IUser";
import {HttpService} from "./http.service";
import {EventService} from "./event.service";
import {EVENT_TYPE} from "../_enums/EVENT_TYPE";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userAccount!: IUser

  $userOwner = new Subject<IUser | null>()
  $userAccount = new BehaviorSubject<IUser | null>(null)
  $isRegistering = new Subject<boolean>()
  $message = new Subject<string>()
  $isLoggedIn = new Subject<boolean>()

  inviteesAccounts! : IUser[]
  $inviteesAccounts = new BehaviorSubject<IUser[]>([])

  constructor(private httpService: HttpService, private eventService: EventService) {
  }

  setRegistering(bool: boolean) {
    this.$isRegistering.next(bool)
  }

  getUserAccount(){
    return this.userAccount
  }

  getInvitees(){
    return this.inviteesAccounts
  }

  getInviteesAccounts(){
    this.httpService.getAllAccounts().pipe(first()).subscribe({
      next:(accounts)=>{
        this.inviteesAccounts = accounts.filter(user => user.id !== this.userAccount.id)
        this.$inviteesAccounts.next(this.inviteesAccounts)
      },
      error:()=>{
        this.$message.next(ERROR.EVENT_SERVICE_HTTP_ERROR)
      }
    })
  }

  getUserById(userId: string){
    this.httpService.getUserById(userId).pipe(first()).subscribe({
      next:(user)=>{
        this.$userOwner.next(user[0])
      },
      error:()=>{
        this.$message.next(ERROR.LOGIN_HTTP_ERROR)
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
        this.eventService.getEventList(userOk.id, EVENT_TYPE.ALL)
        this.getInviteesAccounts()
      },
      error: () => {
        this.$message.next(ERROR.LOGIN_HTTP_ERROR)
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
        this.eventService.getEventList(user.id, EVENT_TYPE.ALL)
        this.setRegistering(false)
      },
      error: ()=>{
        this.$message.next(ERROR.REGISTER_HTTP_ERROR)
      }
    })
  }

  logout(){
    this.$userAccount.next(null)
    this.$userOwner.next(null)
    this.$isLoggedIn.next(false)
  }
}
