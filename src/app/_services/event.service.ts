import {Injectable} from '@angular/core';
import {BehaviorSubject, first, Subject} from "rxjs";
import {HttpService} from "./http.service";
import {IEvent} from "../_interfaces/IEvent";
import {EVENT_TYPE} from "../_enums/EVENT_TYPE";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {ERROR} from "../_enums/ERROR";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  $eventError = new Subject<string>();
  $eventList = new BehaviorSubject<IEvent[]>([])
  $isCreatingEvent = new Subject<boolean>()
  $isEditingEvent = new Subject<boolean>()
  $currentEvent = new BehaviorSubject<IEvent | null>(null)

  private startDate!: Date | null
  $startDate = new BehaviorSubject<Date | null>(null)
  private endDate!: Date | null
  $endDate = new BehaviorSubject<Date | null>(null)
  $fromDate = new BehaviorSubject<NgbDate | null>(null)
  $toDate = new BehaviorSubject<NgbDate | null>(null)

  private eventList! : IEvent[]
  private event!: IEvent
  private userId!: string
  private eventType: EVENT_TYPE = EVENT_TYPE.ALL

  constructor(private httpService: HttpService) { }

  getEventList(id: string, type: EVENT_TYPE) {
    this.userId = id
    this.eventType = type
    this.httpService.getEvents().pipe(first()).subscribe({
      next: (list) => {
        this.eventList = list.filter(x=>x.ownerId.id === id || x.invitees.map(v=>v.id).includes(id)).sort((a,b) =>{
          if (a.date > b.date) {
            return 1
          }
          if (a.date < b.date) {
            return -1
          }
          return 0
        })
        if (type === EVENT_TYPE.INVITED) {
          this.eventList = this.eventList.filter(x=>x.ownerId.id !== id)
        }
        if (type === EVENT_TYPE.OWNED) {
          this.eventList = this.eventList.filter(x=>x.ownerId.id === id)
        }
        if (this.startDate && this.endDate) {
          // @ts-ignore
          this.eventList = this.eventList.filter(event => (new Date(event.date).getTime() >= this.startDate?.getTime()) && (new Date(event.date.substring(0,10)).getTime() <= this.endDate?.getTime()))
        }
        this.$eventList.next(this.eventList)
      },
      error: () => {
        this.$eventError.next(ERROR.EVENT_SERVICE_HTTP_ERROR)
      }
    })
  }

  onClickNewEvent(){
    this.$isCreatingEvent.next(true)
    this.$currentEvent.next(null)
  }

  onClickCancel() {
    this.$isCreatingEvent.next(false)
    this.$isEditingEvent.next(false)
  }

  createNewEvent(newEvent: IEvent){
    this.httpService.createEvent(newEvent).pipe(first()).subscribe({
      next:(data)=>{
        this.$isCreatingEvent.next(false)
        this.getEventList(data.ownerId.id, EVENT_TYPE.ALL)
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

  deleteEvent(eventId: string, userId: string) {
    this.httpService.deleteEvent(eventId).pipe(first()).subscribe({
      next:()=>{
        this.getEventList(userId, this.eventType)
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

  updateEvent(event: IEvent){
    console.log(event)
    this.httpService.updateEvent(event).pipe(first()).subscribe({
      next:(data)=>{
        this.getEventList(data.ownerId.id, this.eventType)
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

  setDates(fromDate:NgbDate | null, toDate:NgbDate | null){
    this.cleanDates()
    if (fromDate && toDate) {
      this.$startDate.next(new Date(fromDate.year, fromDate.month-1, fromDate.day))
      this.startDate = new Date(fromDate.year, fromDate.month-1, fromDate.day)
      this.endDate = new Date(toDate.year, toDate.month-1, toDate.day)
      this.$fromDate.next(fromDate)
      this.$endDate.next(new Date(toDate.year, toDate.month-1, toDate.day))
      this.$toDate.next(toDate)
    }
    this.getEventList(this.userId, this.eventType)
  }

  cleanDates() {
    this.$startDate.next(null)
    this.$endDate.next(null)
    this.$fromDate.next(null)
    this.$toDate.next(null)
    this.startDate = null
    this.endDate = null
    this.getEventList(this.userId, this.eventType)
  }

  onSearchEvents(search: string) {
    let results = []
    for (let event of this.eventList) {
      for (let [key, field] of Object.entries(event)) {
        if (key !== 'id') {
          if (key === 'invitees'){
            for(let [key1, user] of Object.entries(field)){
              // @ts-ignore
              let name = user.name+' '+user.lastName
              // @ts-ignore
              if (name.toLowerCase().includes(search.toLowerCase())) {
                results.push(event)
                break
              }
            }
          }
          if(key === 'date')
            field = new Date(field).toString().substring(0,21)
          if(field) {
            if (field.toString().toLowerCase().includes(search.toLowerCase())) {
              results.push(event)
              break
            }
          }
        }
      }
    }
    this.$eventList.next(results)
  }

  onLogout(){
    this.$isEditingEvent.next(false)
    this.$isCreatingEvent.next(false)
    this.cleanDates()
  }
}
