import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmiCalculatorPage } from './emi-calculator.page';

describe('EmiCalculatorPage', () => {
  let component: EmiCalculatorPage;
  let fixture: ComponentFixture<EmiCalculatorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmiCalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
