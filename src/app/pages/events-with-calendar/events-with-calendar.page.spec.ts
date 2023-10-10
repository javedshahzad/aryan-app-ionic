import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsWithCalendarPage } from './events-with-calendar.page';

describe('EventsWithCalendarPage', () => {
  let component: EventsWithCalendarPage;
  let fixture: ComponentFixture<EventsWithCalendarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventsWithCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
