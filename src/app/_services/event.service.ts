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
  $typeView = new BehaviorSubject<boolean>(true)
  $isSoloEvent = new BehaviorSubject<boolean>(false)

  private startDate!: Date
  $startDate = new BehaviorSubject<Date | null>(null)
  private endDate!: Date
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
        list.map(x=>x.date = new Date(x.date))
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
        if (this.startDate !== this.endDate) {
          this.eventList = this.eventList.filter(event => (event.date >= this.startDate) && (event.date.getTime() <= this.endDate.getTime() + 86400000))
        }
        this.$eventList.next(this.eventList)
      },
      error: () => {
        this.$eventError.next(ERROR.EVENT_SERVICE_HTTP_ERROR)
      }
    })
  }

  getEventById(id: string) {
    this.httpService.getEventById(id).pipe(first()).subscribe({
      next:(data)=>{
        data.date = new Date(data.date)
        this.$currentEvent.next(data)
        this.event = data
        this.$isSoloEvent.next(true)
      },
      error:()=>{
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
      error:()=>{
        this.$eventError.next(ERROR.EVENT_SERVICE_HTTP_ERROR)
      }
    })
  }

  deleteEvent(eventId: string, userId: string) {
    this.httpService.deleteEvent(eventId).pipe(first()).subscribe({
      next:()=>{
        this.getEventList(userId, this.eventType)
      },
      error:()=>{
        this.$eventError.next(ERROR.EVENT_SERVICE_HTTP_ERROR)
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
      error:()=>{
        this.$eventError.next(ERROR.EVENT_SERVICE_HTTP_ERROR)
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
    this.startDate = new Date()
    this.endDate = this.startDate
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
              if (name.toLowerCase().includes(search.toLowerCase())) {
                results.push(event)
                break
              }
            }
          }
          if(key === 'date')
            field = new Date(field).toLocaleDateString('en-US',{weekday: 'long', month: 'long', day: "2-digit", hour: '2-digit', minute: "2-digit", year: "numeric"})
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
