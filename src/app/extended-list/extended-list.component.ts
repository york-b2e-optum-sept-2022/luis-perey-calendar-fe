import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {IUser} from "../_interfaces/IUser";
import {EventService} from "../_services/event.service";
import {UserService} from "../_services/user.service";
import {Subscription} from "rxjs";
import {STATUS} from "../_enums/STATUS";

@Component({
  selector: 'app-extended-list',
  templateUrl: './extended-list.component.html',
  styleUrls: ['./extended-list.component.css']
})
export class ExtendedListComponent implements OnInit, OnDestroy {

  subscription: Subscription
  @Input() event! : IEvent
  user! : IUser
  asInvitedStatus: STATUS = STATUS.PENDING

  constructor(private eventService: EventService, private userService: UserService) {
    this.subscription = this.userService.$userAccount.subscribe(user=> {if (user !== null) this.user = user})
  }

  ngOnInit(): void {
    if (this.event.invitees.find(x => x.id === this.user.id))
      // @ts-ignore
      this.asInvitedStatus = this.event.invitees.find(x => x.id === this.user.id).status
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

  onClickAcceptInvitation() {
    this.eventService.updateInvitation(this.event, STATUS.ACCEPTED)
  }

  onClickRejectInvitation() {
    this.eventService.updateInvitation(this.event, STATUS.REJECTED)
  }
}
