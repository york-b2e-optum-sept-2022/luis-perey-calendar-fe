import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedListComponent } from './extended-list.component';

describe('ExtendedListComponent', () => {
  let component: ExtendedListComponent;
  let fixture: ComponentFixture<ExtendedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
