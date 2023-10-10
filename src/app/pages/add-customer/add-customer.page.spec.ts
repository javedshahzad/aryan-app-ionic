import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCustomerPage } from './add-customer.page';

describe('AddCustomerPage', () => {
  let component: AddCustomerPage;
  let fixture: ComponentFixture<AddCustomerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
