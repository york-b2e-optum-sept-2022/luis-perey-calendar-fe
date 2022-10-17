import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { IUser } from '../_interfaces/IUser';
import {UserService} from "../_services/user.service";
import { IEvent } from '../_interfaces/IEvent';
import {v4 as uuid} from 'uuid';
import { EventService } from '../_services/event.service';
import {ERROR} from "../_enums/ERROR";
import {IEventError} from "../_interfaces/IEventError";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  eventForm!: FormGroup;
  invitees! : IUser[]
  userAccount! : IUser | null
  event!: IEvent | null
  message: string | null = null

  error : IEventError = {
    name: null,
    description: null,
    place: null,
    address: null,
    date: null,
    time: null,
    duration: null
  }

  constructor(private userService: UserService,
              private fb:FormBuilder,
              private eventService: EventService) {
    this.subscriptions.push(this.userService.$inviteesAccounts.subscribe(val=> this.invitees = val))
    this.subscriptions.push(this.userService.$userAccount.subscribe(val=>this.userAccount = val))
    this.subscriptions.push(this.eventService.$currentEvent.subscribe(val=>this.event = val))
    this.subscriptions.push(this.eventService.$eventError.subscribe(mess=> this.message = mess))
  }

  ngOnInit(): void {
    let eventDate = null
    let eventTime = null
    if (this.event) {
      let d = this.event.date
      eventDate = {year: d.getFullYear(), month:d.getMonth()+1,day:d.getDate()}
      eventTime = {hour: d.getHours(), minute:d.getMinutes()}
    }
    this.eventForm = this.fb.group({
      name: this.event?.name,
      date: eventDate,
      time: eventTime,
      description: this.event?.description,
      place: this.event?.place,
      address: this.event?.address,
      duration: this.event?.duration,
      invitees: this.buildInvitees()
    })
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  get name() {
    let space :string = ''
    if (!this.eventForm.get('name'))
      return space
    return this.eventForm.get('name');
  }

  buildInvitees(){
    return this.fb.array(this.invitees.map(x=> {
      return new FormControl(this.event?.invitees.map(x=>x.id).includes(x.id))
    }))
  }

  onSubmit(){
    let valueSubmit = Object.assign({}, this.eventForm.value)
    valueSubmit = Object.assign(valueSubmit,{
      invitees: valueSubmit.invitees.map((v:boolean,i:number)=> v ? this.invitees[i] : null).filter((v: any) => v !== null)
    })
    this.error = {
      name: null,
      description: null,
      place: null,
      address: null,
      date: null,
      time: null,
      duration: null
    }
    if(!valueSubmit.name){
      this.error.name = ERROR.EVENT_INVALID_NAME
      return
    }
    if (!valueSubmit.description){
      this.error.description = ERROR.EVENT_INVALID_DESCRIPTION
      return
    }
    if (!valueSubmit.place){
      this.error.place = ERROR.EVENT_INVALID_PLACE
      return
    }
    if (!valueSubmit.address){
      this.error.address = ERROR.EVENT_INVALID_ADDRESS
      return
    }
    if (!valueSubmit.date){
      this.error.date = ERROR.EVENT_INVALID_DATE
      return
    }
    if (!valueSubmit.time){
      this.error.time = ERROR.EVENT_INVALID_TIME
      return
    }
    if (!valueSubmit.duration){
      this.error.duration = ERROR.EVENT_INVALID_DURATION
      return
    }
    if (valueSubmit.duration < 15){
      this.error.duration = ERROR.EVENT_INVALID_DURATION_TIME
      return
    }
    let date = this.eventForm.value.date
    let time = this.eventForm.value.time
    const newEvent = !this.event?.id
    let event: IEvent = {
      id: !this.event?.id ? uuid() : this.event.id,
      // @ts-ignore
      ownerId: this.userAccount,
      date: new Date(date.year, date.month-1, date.day,time.hour, time.minute, 0),
      name: this.eventForm.value.name,
      description: this.eventForm.value.description,
      place: this.eventForm.value.place,
      address: this.eventForm.value.address,
      duration: this.eventForm.value.duration,
      invitees: valueSubmit.invitees
    }
    newEvent ? this.eventService.createNewEvent(event) : this.eventService.updateEvent(event)
  }

  onCancelClick(){
    this.eventService.onClickCancel()
  }
}
