import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IUser} from "../_interfaces/IUser";
import {IEvent} from "../_interfaces/IEvent";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  getUserByEmail(email: string) {
    return this.httpClient.get('http://localhost:3000/accounts?email=' + email) as Observable<IUser[]>;
  }

  getUserById(id: string) {
    return this.httpClient.get('http://localhost:3000/accounts?id='+ id) as Observable<IUser[]>;
  }

  getAllAccounts(){
    return this.httpClient.get('http://localhost:3000/accounts') as Observable<IUser[]>;
  }

  createUser(newUser: IUser) {
    return this.httpClient.post('http://localhost:3000/accounts', newUser) as Observable<IUser>;
  }

  getEvents() {
    return this.httpClient.get('http://localhost:3000/events') as Observable<IEvent[]>;
  }

  createEvent(newEvent: IEvent) {
    return this.httpClient.post('http://localhost:3000/events', newEvent) as Observable<IEvent>;
  }

  deleteEvent(id: string) {
    return this.httpClient.delete('http://localhost:3000/events/'+id) as Observable<IEvent>;
  }

  updateEvent(event: IEvent){
    return this.httpClient.put('http://localhost:3000/events/'+event.id, event) as Observable<IEvent>;
  }

}
