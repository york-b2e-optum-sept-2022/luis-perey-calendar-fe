import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {EventService} from "../_services/event.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.css']
})
export class DatePickerRangeComponent implements OnInit {

  hoveredDate: NgbDate | null = null;
  subscriptions: Subscription[] = []

  @Output() onStartDate = new EventEmitter<NgbDate | null>;
  @Output() onEndDate = new EventEmitter<NgbDate | null>;

  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;

  constructor(private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter,
              private eventService: EventService) {
    this.subscriptions.push(this.eventService.$fromDate.subscribe(date => this.fromDate = date))
    this.subscriptions.push(this.eventService.$toDate.subscribe(date => this.toDate = date))
  }

  ngOnInit(){
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.onStartDate.emit(this.fromDate)
    this.onEndDate.emit(this.toDate)
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
