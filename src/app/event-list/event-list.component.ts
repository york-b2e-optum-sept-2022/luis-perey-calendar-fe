import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {IEvent} from "../_interfaces/IEvent";
import {EventService} from "../_services/event.service";
import {UserService} from "../_services/user.service";
import {IUser} from "../_interfaces/IUser";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {

  collection!: number
  pageSize: number = 4
  page: number = 1
  subscriptions: Subscription[] = []
  eventList! : IEvent[]
  message: string | null = ''
  currentUser!: IUser | null
  onDestroy = new Subject();
  extendedList!: boolean
  isSoloEvent: boolean = false

  constructor(private eventService: EventService, private userService : UserService) {
    this.subscriptions.push(this.eventService.$eventList.subscribe(list=> {
      this.eventList = list
      this.collection = list.length
    }))
    this.subscriptions.push(this.userService.$userAccount.subscribe(user=>this.currentUser = user))
    this.subscriptions.push(this.eventService.$typeView.subscribe(view=>this.extendedList = view))
    this.subscriptions.push(this.eventService.$isSoloEvent.subscribe((val)=>{this.isSoloEvent = val}))
    this.subscriptions.push(this.eventService.$eventError.subscribe(message => this.message = message))
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

}
