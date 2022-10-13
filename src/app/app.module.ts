import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EventListComponent } from './event-list/event-list.component';
import { OwnEventComponent } from './own-event/own-event.component';
import { InviteEventComponent } from './invite-event/invite-event.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EventFormComponent } from './event-form/event-form.component';
import { DatePickerRangeComponent } from './date-picker-range/date-picker-range.component';
import { DateModalComponent } from './date-modal/date-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EventListComponent,
    OwnEventComponent,
    InviteEventComponent,
    NavBarComponent,
    EventFormComponent,
    DatePickerRangeComponent,
    DateModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
