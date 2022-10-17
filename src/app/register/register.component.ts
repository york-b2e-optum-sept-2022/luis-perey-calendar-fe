import {Component, OnDestroy, OnInit} from '@angular/core';
import {IUser} from "../_interfaces/IUser";
import {UserService} from "../_services/user.service";
import {Subscription} from "rxjs";
import {STATUS} from "../_enums/STATUS";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  subscription: Subscription
  user : IUser = {
    id: '',
    name: '',
    lastName: '',
    email: '',
    password: '',
    status: STATUS.PENDING
  }
  repeatPassword: string = ''
  message: string = ''

  constructor(private userService: UserService) {
    this.subscription = this.userService.$message.subscribe((mes) => this.message = mes)
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onSubmitRegister() {
    this.userService.onRegister(this.user, this.repeatPassword)
  }

  onCancelClick() {
    this.userService.setRegistering(false)
  }
}
