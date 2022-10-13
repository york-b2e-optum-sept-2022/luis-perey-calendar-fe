import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../_interfaces/IUser";
import {EventService} from "../_services/event.service";
import { UserService } from '../_services/user.service';
import {EVENT_TYPE} from "../_enums/EVENT_TYPE";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  subscriptions: Subscription[] = []
  @Input() user = {} as IUser | null
  isCreatingEvent: boolean = false
  isEditingEvent: boolean = false
  eventsAll: boolean = true
  eventsOwned: boolean = false
  eventsInvited: boolean = false
  search: string = ''

  startDate!: Date | null
  endDate!: Date | null

  constructor(private eventService: EventService,
              private userService: UserService) {
    this.subscriptions.push(this.eventService.$isCreatingEvent.subscribe(status=> this.isCreatingEvent = status))
    this.subscriptions.push(this.eventService.$isEditingEvent.subscribe(status=> this.isEditingEvent = status))
    this.subscriptions.push(this.eventService.$startDate.subscribe(date=> this.startDate = date))
    this.subscriptions.push(this.eventService.$endDate.subscribe(date=> this.endDate = date))
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  onClickNew(){
    this.userService.getInviteesAccounts()
    this.userService.getInvitees()
    this.eventService.onClickNewEvent()
  }

  onClickLogout(){
    this.eventService.onLogout()
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

  onSearch(){
    this.eventService.onSearchEvents(this.search)
  }
}
