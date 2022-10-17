import {Component, OnDestroy, OnInit} from '@angular/core';
import {IEvent} from "../_interfaces/IEvent";
import {EventService} from "../_services/event.service";
import {UserService} from "../_services/user.service";
import {IUser} from "../_interfaces/IUser";
import {Subscription} from "rxjs";
import {STATUS} from "../_enums/STATUS";

@Component({
  selector: 'app-solo-event',
  templateUrl: './solo-event.component.html',
  styleUrls: ['./solo-event.component.css']
})
export class SoloEventComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  event!: IEvent
  user!: IUser
  asInvitedStatus: STATUS = STATUS.PENDING
  message: string | null = null

  constructor(private eventService: EventService,
              private userService: UserService) {
    this.subscriptions.push(this.eventService.$currentEvent.subscribe(event=> {if (event !== null) this.event = event}))
    this.subscriptions.push(this.userService.$userAccount.subscribe(user=> {if (user !== null) this.user = user}))
    this.subscriptions.push(this.eventService.$eventError.subscribe(mess=> this.message = mess))
  }

  ngOnInit(): void {
    if (this.event.invitees.find(x => x.id === this.user.id))
      // @ts-ignore
      this.asInvitedStatus = this.event.invitees.find(x => x.id === this.user.id).status
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  onClickBack(){
    this.eventService.$isSoloEvent.next(false)
  }

  onClickDelete(){
    this.user = this.userService.getUserAccount()
    this.eventService.deleteEvent(this.event.id, this.user.id)
  }

  onEditClick(){
    this.eventService.$isSoloEvent.next(false)
    this.eventService.onClickEdit(this.event)
  }

  onClickAcceptInvitation() {
    this.eventService.updateInvitation(this.event, STATUS.ACCEPTED)
    if (!this.message) {
      this.asInvitedStatus = STATUS.ACCEPTED
    }
  }

  onClickRejectInvitation() {
    this.eventService.updateInvitation(this.event, STATUS.REJECTED)
    if (!this.message) {
      this.asInvitedStatus = STATUS.REJECTED
    }
  }
}
