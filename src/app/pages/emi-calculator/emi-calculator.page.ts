import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.page.html',
  styleUrls: ['./emi-calculator.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EmiCalculatorPage implements OnInit {
  amount:any;
  rate:any;
  time:any;
  output:any=0;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  calculate(){
    var amount=this.amount;
    var rate=this.rate;
    var time=this.time;
    const interest = (amount * (rate * 0.01)) / time;
    let emi = ((amount / time) + interest).toFixed(2);
    //emi = emi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.output = emi;
 }
 gotoBack(){
  this.router.navigateByUrl("/customer-landing")
}
}
