import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCustomerDetailsPage } from './edit-customer-details.page';

describe('EditCustomerDetailsPage', () => {
  let component: EditCustomerDetailsPage;
  let fixture: ComponentFixture<EditCustomerDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditCustomerDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
