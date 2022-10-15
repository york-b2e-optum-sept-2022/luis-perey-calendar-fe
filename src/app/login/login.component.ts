import { Component, OnInit } from '@angular/core';
import {UserService} from "../_services/user.service";
import {ILoginForm} from "../_interfaces/ILoginForm";
import {IUser} from "../_interfaces/IUser";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  subscription: Subscription
  user! : IUser
  message: string = ''

  constructor(private userService: UserService) {
    this.subscription = this.userService.$message.subscribe((message) => this.message = message)
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onClickRegister() {
    this.userService.setRegistering(true)
  }

  onClickLogin(form: NgForm){
    this.userService.onLogin(form.value as ILoginForm)
  }
}
