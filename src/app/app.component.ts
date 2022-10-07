import {Component, Input} from '@angular/core';
import {UserService} from "./_services/user.service";
import {IUser} from "./_interfaces/IUser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'store-test';
  register: boolean = false
  user!: IUser;
  @Input() isLogout: boolean = false
  isLoggedIn: boolean = false

  constructor(private serviceUser: UserService){
    this.serviceUser.$isRegistering.subscribe(
      (val)=>{this.register = val}
    )
    this.serviceUser.$userAccount.subscribe(
      (val)=>{this.user = val}
    )
    this.serviceUser.$isLoggedIn.subscribe(
      (val)=>{this.isLoggedIn = val}
    )
  }


}
