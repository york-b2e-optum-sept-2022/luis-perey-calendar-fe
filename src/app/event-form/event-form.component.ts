import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { IUser } from '../_interfaces/IUser';
import {UserService} from "../_services/user.service";
import { IEvent } from '../_interfaces/IEvent';
import {v4 as uuid} from 'uuid';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {

  eventForm!: FormGroup;
  invitees! : IUser[]
  userAccount! : IUser | null
  event!: IEvent | null

  constructor(private userService: UserService,
              private fb:FormBuilder,
              private eventService: EventService) {
    this.userService.$inviteesAccounts.subscribe(val=> this.invitees = val)
    this.userService.$userAccount.subscribe(val=>this.userAccount = val)
    this.eventService.$currentEvent.subscribe(val=>this.event = val)
  }

  ngOnInit(): void {
    let eventDate = {}
    let eventTime = {}
    if (this.event?.id !== '') {
      // @ts-ignore
      let d = new Date(Date.parse(this.event?.date))
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
    let date = this.eventForm.value.date
    let time = this.eventForm.value.time
    console.log(date, time)
    if(!this.event?.id) {
      let newEvent: IEvent = {
        id: uuid(),
        // @ts-ignore
        ownerId: this.userAccount,
        date: new Date(date.year, date.month-1, date.day,time.hour, time.minute, time.second),
        name: this.eventForm.value.name,
        description: this.eventForm.value.description,
        place: this.eventForm.value.place,
        address: this.eventForm.value.address,
        invitees: valueSubmit.invitees
      }
      this.eventService.createNewEvent(newEvent)
    } else {
      let event: IEvent = {
        id: this.event.id,
        // @ts-ignore
        ownerId: this.userAccount,
        date: new Date(date.year, date.month-1, date.day,time.hour, time.minute, 0),
        name: this.eventForm.value.name,
        description: this.eventForm.value.description,
        place: this.eventForm.value.place,
        address: this.eventForm.value.address,
        invitees: valueSubmit.invitees
      }
      this.eventService.updateEvent(event)
    }
  }

  onCancelClick(){
    this.eventService.onClickCancel()
  }
}
