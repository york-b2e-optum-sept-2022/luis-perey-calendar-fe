import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnEventComponent } from './own-event.component';

describe('OwnEventComponent', () => {
  let component: OwnEventComponent;
  let fixture: ComponentFixture<OwnEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
