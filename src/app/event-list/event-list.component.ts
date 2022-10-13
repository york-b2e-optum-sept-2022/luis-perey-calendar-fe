import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {IEvent} from "../_interfaces/IEvent";
import {EventService} from "../_services/event.service";
import {UserService} from "../_services/user.service";
import {IUser} from "../_interfaces/IUser";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  eventList! : IEvent[]
  message: string = ''
  currentUser!: IUser | null
  onDestroy = new Subject();

  constructor(private eventService: EventService, private userService : UserService) {
    this.eventService.$eventList.subscribe(list=>this.eventList = list)
    this.userService.$userAccount.subscribe(user=>this.currentUser = user)
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
