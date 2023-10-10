import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerLandingPage } from './customer-landing.page';

describe('CustomerLandingPage', () => {
  let component: CustomerLandingPage;
  let fixture: ComponentFixture<CustomerLandingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomerLandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
