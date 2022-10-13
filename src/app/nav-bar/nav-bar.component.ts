import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../_interfaces/IUser";
import {EventService} from "../_services/event.service";
import { UserService } from '../_services/user.service';
import {EVENT_TYPE} from "../_enums/EVENT_TYPE";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Input() user = {} as IUser | null
  isCreatingEvent: boolean = false
  isEditingEvent: boolean = false
  eventsAll: boolean = true
  eventsOwned: boolean = false
  eventsInvited: boolean = false

  startDate!: Date | null
  endDate!: Date | null

  constructor(private eventService: EventService,
              private userService: UserService) {
    this.eventService.$isCreatingEvent.subscribe(status=> this.isCreatingEvent = status)
    this.eventService.$isEditingEvent.subscribe(status=> this.isEditingEvent = status)
    this.eventService.$startDate.subscribe(date=> this.startDate = date)
    this.eventService.$endDate.subscribe(date=> this.endDate = date)
  }

  ngOnInit(): void {
  }

  onClickNew(){
    this.userService.getInviteesAccounts()
    this.userService.getInvitees()
    this.eventService.onClickNewEvent()
  }

  onClickLogout(){
    this.userService.logout()
  }

  onClickShowEvents(eventType: string) {
    // @ts-ignore
    this.eventService.getEventList(this.user.id, eventType)
    if (eventType === EVENT_TYPE.ALL) {
      this.eventsAll = true
      this.eventsInvited = false
      this.eventsOwned = false
      return
    }
    if (eventType === EVENT_TYPE.OWNED) {
      this.eventsAll = false
      this.eventsInvited = false
      this.eventsOwned = true
      return
    }
    if (eventType === EVENT_TYPE.INVITED) {
      this.eventsAll = false
      this.eventsInvited = true
      this.eventsOwned = false
      return
    }
  }
}
