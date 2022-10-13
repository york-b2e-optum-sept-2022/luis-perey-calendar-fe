import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {EventService} from "../_services/event.service";

@Component({
  selector: 'app-date-modal',
  templateUrl: './date-modal.component.html',
  styleUrls: ['./date-modal.component.css']
})
export class DateModalComponent implements OnInit {

  closeResult = '';
  fromDate: NgbDate | null = null
  toDate: NgbDate | null = null
  startDate: Date | null = null
  endDate: Date | null = null


  constructor(private modalService: NgbModal,
              private eventService: EventService) {
    this.eventService.$startDate.subscribe(date=>this.startDate = date)
    this.eventService.$endDate.subscribe(date=>this.endDate = date)
  }

  ngOnInit(){

  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  onSave() {
    if (this.fromDate && this.toDate) {
      this.eventService.setDates(this.fromDate, this.toDate)
      this.startDate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day)
      this.endDate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day)
    }
    this.modalService.dismissAll()
  }

  getStartDate(date: NgbDate | null) {
    this.fromDate = date
  }

  getEndDate(date: NgbDate | null) {
    this.toDate = date
  }

  onClickClear(){
    this.eventService.cleanDates()
    this.modalService.dismissAll()
  }
}
