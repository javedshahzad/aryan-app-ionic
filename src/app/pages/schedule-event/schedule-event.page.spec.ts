import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleEventPage } from './schedule-event.page';

describe('ScheduleEventPage', () => {
  let component: ScheduleEventPage;
  let fixture: ComponentFixture<ScheduleEventPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScheduleEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
