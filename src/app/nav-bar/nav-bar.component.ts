import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../_interfaces/IUser";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Input() user = {} as IUser

  constructor() { }

  ngOnInit(): void {
  }

}
