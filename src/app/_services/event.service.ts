import { Injectable } from '@angular/core';
import {BehaviorSubject, first, Subject} from "rxjs";
import {HttpService} from "./http.service";
import {ERROR} from "../_enums/ERROR";
import {IUser} from "../_interfaces/IUser";
import {IEvent} from "../_interfaces/IEvent";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  $eventError = new Subject<string>();
  $eventList = new BehaviorSubject<IEvent[]>([])
  $isCreatingEvent = new Subject<boolean>()
  $isEditingEvent = new Subject<boolean>()
  $currentEvent = new BehaviorSubject<IEvent | null>(null)

  private eventOwner!: IUser
  private eventList! : IEvent[]
  private event!: IEvent

  constructor(private httpService: HttpService) { }

  getEventByOwnerId(ownerId: string){
    this.httpService.getUserById(ownerId).pipe(first()).subscribe({
      next:(user)=>{
        this.eventOwner = user[0]
      },
      error:()=>{
        this.$eventError.next(ERROR.EVENT_SERVICE_HTTP_ERROR)
      }
    })
    return this.eventOwner
  }

  getEventList(id: string) {
    console.log(id)
    this.httpService.getEvents().pipe(first()).subscribe({
      next: (list) => {
        this.eventList = list.filter(x=>x.ownerId.id === id || x.invitees.map(v=>v.id).includes(id))
        this.$eventList.next(this.eventList)
      },
      error: (err) => {
        console.error(err) // = ERROR.EVENT_SERVICE_HTTP_ERROR
      }
    })
  }

  getEvents() {
    return this.eventList
  }

  onClickNewEvent(){
    this.$isCreatingEvent.next(true)

    this.event = {
      id:'',
      ownerId:this.eventOwner,
      date: new Date(),
      name: '',
      // @ts-ignore
      invitees: []
      }

    this.$currentEvent.next(this.event)
  }

  onClickCancel() {
    this.$isCreatingEvent.next(false)
    this.$isEditingEvent.next(false)
  }

  createNewEvent(newEvent: IEvent){
    this.httpService.createEvent(newEvent).pipe(first()).subscribe({
      next:(data)=>{
        this.$isCreatingEvent.next(false)
        this.getEventList(data.ownerId.id)
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

  deleteEvent(eventId: string, userId: string) {
    this.httpService.deleteEvent(eventId).pipe(first()).subscribe({
      next:()=>{
        this.getEventList(userId)
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

  updateEvent(event: IEvent){
    this.httpService.updateEvent(event).pipe(first()).subscribe({
      next:(data)=>{
        this.getEventList(data.ownerId.id)
        this.$isEditingEvent.next(false)
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

  onClickEdit(event: IEvent){
    this.event = event
    this.$isEditingEvent.next(true)
    this.$currentEvent.next(event)
  }

}
