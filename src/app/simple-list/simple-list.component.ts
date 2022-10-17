import {Component, OnDestroy, OnInit} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {EventService} from "../_services/event.service";
import {UserService} from "../_services/user.service";
import {IUser} from "../_interfaces/IUser";
import {Subscription} from "rxjs";
import {STATUS} from "../_enums/STATUS";

@Component({
  selector: 'app-simple-list',
  templateUrl: './simple-list.component.html',
  styleUrls: ['./simple-list.component.css']
})
export class SimpleListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  eventList!: IEvent[]
  user!: IUser

  constructor(private eventService: EventService,
              private userService: UserService) {
    this.subscriptions.push(this.eventService.$eventList.subscribe(x=>this.eventList = x))
    this.subscriptions.push(this.userService.$userAccount.subscribe(x=> {if(x !== null) this.user = x}))
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  onClickDelete(id: string){
    this.user = this.userService.getUserAccount()
    this.eventService.deleteEvent(id, this.user.id)
  }

  onEditClick(event: IEvent){
    this.eventService.onClickEdit(event)
  }

  onClickViewEvent(id: string) {
    this.eventService.getEventById(id)
  }

  onClickAcceptInvitation(event: IEvent) {
    this.eventService.updateInvitation(event, STATUS.ACCEPTED)
  }

  onClickRejectInvitation(event: IEvent){
    this.eventService.updateInvitation(event, STATUS.REJECTED)
  }
}

