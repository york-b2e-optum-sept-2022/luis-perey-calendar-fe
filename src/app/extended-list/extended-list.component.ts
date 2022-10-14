import {Component, Input, OnInit} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {IUser} from "../_interfaces/IUser";
import {EventService} from "../_services/event.service";
import {UserService} from "../_services/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-extended-list',
  templateUrl: './extended-list.component.html',
  styleUrls: ['./extended-list.component.css']
})
export class ExtendedListComponent implements OnInit {

  subscription: Subscription
  @Input() event! : IEvent
  user! : IUser | null

  constructor(private eventService: EventService, private userService: UserService) {
    this.subscription = this.userService.$userAccount.subscribe(user=> this.user = user)
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onClickDelete(){
    this.user = this.userService.getUserAccount()
    this.eventService.deleteEvent(this.event.id, this.user.id)
  }

  onEditClick(){
    this.eventService.onClickEdit(this.event)
  }

  onClickViewEvent(id: string){
    this.eventService.getEventById(id)
  }
}
