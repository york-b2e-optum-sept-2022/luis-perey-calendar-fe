import { Component, OnInit } from '@angular/core';
import {IUser} from "../_interfaces/IUser";
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user : IUser = {
    id: '',
    name: '',
    lastName: '',
    email: '',
    password: ''
  }
  repeatPassword: string = ''
  message: string = ''

  constructor(private userService: UserService) {
    this.userService.$message.subscribe(
      (mes) => this.message = mes)
  }

  ngOnInit(): void {
  }

  onSubmitRegister() {
    this.userService.onRegister(this.user, this.repeatPassword)
  }

  onCancelClick() {
    this.userService.setRegistering(false)
  }
}
