import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteEventComponent } from './invite-event.component';

describe('InviteEventComponent', () => {
  let component: InviteEventComponent;
  let fixture: ComponentFixture<InviteEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
