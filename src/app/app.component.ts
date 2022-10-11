import {Component, Input} from '@angular/core';
import {UserService} from "./_services/user.service";
import {IUser} from "./_interfaces/IUser";
import {EventService} from "./_services/event.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @Input() isLogout: boolean = false

  register: boolean = false
  user: IUser | null = null;
  isLoggedIn: boolean = false
  isCreatingEvent: boolean = false
  isEditingEvent: boolean = false

  constructor(private userService: UserService, private eventService: EventService){
    this.userService.$isRegistering.subscribe(
      (val)=>{this.register = val}
    )
    this.userService.$userAccount.subscribe(
      (val)=>{this.user = val}
    )
    this.userService.$isLoggedIn.subscribe(
      (val)=>{this.isLoggedIn = val}
    )
    this.eventService.$isCreatingEvent.subscribe(
      (val)=>{this.isCreatingEvent = val}
    )
    this.eventService.$isEditingEvent.subscribe(
      (val)=>{this.isEditingEvent = val}
    )
  }


}
