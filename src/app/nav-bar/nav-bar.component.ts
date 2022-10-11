import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../_interfaces/IUser";
import {EventService} from "../_services/event.service";
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Input() user = {} as IUser
  isCreatingEvent: boolean = false

  constructor(private eventService: EventService,
              private userService: UserService) {
    this.eventService.$isCreatingEvent.subscribe(status=> this.isCreatingEvent = status)
  }

  ngOnInit(): void {
  }

  onClickNew(){
    this.userService.getAllAccounts()
    this.userService.getInvitees()
    this.eventService.onClickNewEvent()
  }
}
