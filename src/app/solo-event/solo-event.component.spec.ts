import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloEventComponent } from './solo-event.component';

describe('InviteEventComponent', () => {
  let component: SoloEventComponent;
  let fixture: ComponentFixture<SoloEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoloEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoloEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
