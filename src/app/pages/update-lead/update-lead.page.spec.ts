import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateLeadPage } from './update-lead.page';

describe('UpdateLeadPage', () => {
  let component: UpdateLeadPage;
  let fixture: ComponentFixture<UpdateLeadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateLeadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
