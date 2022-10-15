import {Component, OnInit} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {EventService} from "../_services/event.service";
import {UserService} from "../_services/user.service";
import {IUser} from "../_interfaces/IUser";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-simple-list',
  templateUrl: './simple-list.component.html',
  styleUrls: ['./simple-list.component.css']
})
export class SimpleListComponent implements OnInit {

  subscriptions: Subscription[] = []
  eventList!: IEvent[]
  user!: IUser | null

  constructor(private eventService: EventService,
              private userService: UserService) {
    this.subscriptions.push(this.eventService.$eventList.subscribe(x=>this.eventList = x))
    this.subscriptions.push(this.userService.$userAccount.subscribe(x=>this.user = x))
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
}

