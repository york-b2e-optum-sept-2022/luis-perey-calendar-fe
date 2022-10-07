import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IUser} from "../_interfaces/IUser";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  getUserByEmail(email: string) {
    return this.httpClient.get('http://localhost:3000/accounts?email='+ email) as Observable<IUser[]>;
  }

  createUser(newUser: any) {
    return this.httpClient.post('http://localhost:3000/accounts', newUser) as Observable<IUser>;
  }
}
