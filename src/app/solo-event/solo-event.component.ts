import { Component, OnInit } from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {EventService} from "../_services/event.service";
import {UserService} from "../_services/user.service";
import {IUser} from "../_interfaces/IUser";

@Component({
  selector: 'app-solo-event',
  templateUrl: './solo-event.component.html',
  styleUrls: ['./solo-event.component.css']
})
export class SoloEventComponent implements OnInit {

  event!: IEvent | null
  notNullEvent!: IEvent
  user!: IUser | null

  constructor(private eventService: EventService,
              private userService: UserService) {
    this.eventService.$currentEvent.subscribe(event=> this.event = event)
    this.userService.$userAccount.subscribe(user=> this.user = user)
    if (this.event !== null) this.notNullEvent = this.event
  }

  ngOnInit(): void {
  }

  onClickBack(){
    this.eventService.$isSoloEvent.next(false)
  }

  onClickDelete(){
    this.user = this.userService.getUserAccount()
    this.eventService.deleteEvent(this.notNullEvent.id, this.user.id)
  }

  onEditClick(){
    console.log(typeof this.notNullEvent.date, this.notNullEvent.date)
    // @ts-ignore
    console.log(typeof this.event.date, this.event.date)
    this.eventService.$isSoloEvent.next(false)
    this.eventService.onClickEdit(this.notNullEvent)
  }
}
