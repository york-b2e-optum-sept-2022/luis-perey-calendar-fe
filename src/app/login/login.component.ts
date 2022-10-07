import { Component, OnInit } from '@angular/core';
import {UserService} from "../_services/user.service";
import {ILoginForm} from "../_interfaces/ILoginForm";
import {IUser} from "../_interfaces/IUser";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user! : IUser
  message: string = ''

  constructor(private userService: UserService) {
    this.userService.$message.subscribe(
      (message) => this.message = message)
  }

  ngOnInit(): void {
  }

  onClickRegister() {
    this.userService.setRegistering(true)
  }

  onClickLogin(form: NgForm){
    this.userService.onLogin(form.value as ILoginForm)
  }
}
