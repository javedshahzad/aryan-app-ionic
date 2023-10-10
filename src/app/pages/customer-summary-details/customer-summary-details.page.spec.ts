import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerSummaryDetailsPage } from './customer-summary-details.page';

describe('CustomerSummaryDetailsPage', () => {
  let component: CustomerSummaryDetailsPage;
  let fixture: ComponentFixture<CustomerSummaryDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomerSummaryDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
