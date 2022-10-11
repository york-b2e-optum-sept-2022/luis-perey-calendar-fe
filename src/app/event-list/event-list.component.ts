import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpService} from "../_services/http.service";
import {first, Subject, takeUntil} from "rxjs";
import {IEvent} from "../_interfaces/IEvent";
import {ERROR} from "../_enums/ERROR";
import {EventService} from "../_services/event.service";
import {UserService} from "../_services/user.service";
import {IUser} from "../_interfaces/IUser";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  eventList! : IEvent[] | null
  message: string = ''
  currentUser!: IUser
  onDestroy = new Subject();

  constructor(private eventService: EventService, private userService : UserService) {
    this.eventService.$eventList.subscribe(list=>this.eventList = list)
    this.userService.$userAccount.subscribe(user=>this.currentUser = user)
  }

  ngOnInit(): void {
    console.log(this.eventList)
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
