import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Route, Router, RouterLink } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

declare var $: any;

@Component({
  selector: 'app-customer-landing',
  templateUrl: './customer-landing.page.html',
  styleUrls: ['./customer-landing.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class CustomerLandingPage implements OnInit {

  customerDashboardData: any;
  customerDashboardDataLoading: boolean = false;
  updatingCustomerDashboardData: boolean = false;

  isDatePicketInitialized: boolean = false;
  fromDate: string = "";
  toDate: string = "";
  customerStatus: any = {};

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {

  }
  ionViewWillEnter(){
    this.customerDashboardDataLoading = true;
    this.getCustomerDashboardata();
    this.getCustomerStatusdata();
  }
  private getCustomerStatusdata(): void {

    this.dataService.getCustomerStatus({})
      .then((resp: any) => {
        let customerStatusData = JSON.parse(resp.data);
        console.log(customerStatusData)
        this.customerStatus = customerStatusData?.data;

        console.log(this.customerStatus);

      })

  }

  private getCustomerDashboardata(): void {
    let user = localStorage.getItem('aryanUser');
    console.log(user)
    if (user) {
      let data = {
        user_id: JSON.parse(user).user_id,
        login_type: JSON.parse(user).login_type,
        to_date: this.toDate ? this.toDate : '',
        from_date: this.fromDate ? this.fromDate : ''
      }
      console.log("getCustomerDashboard", data)

      this.dataService.getCustomerDashboard(data)
        .then((resp: any) => {
          const response = JSON.parse(resp.data);
          console.log(response);
          this.customerDashboardData = response.data;
          this.customerDashboardDataLoading = false;
          this.updatingCustomerDashboardData = false;

          if (!this.isDatePicketInitialized) {
            setTimeout(() => {
              $(".datepicker").datepicker({
                onSelect: (date: any) => {
                  let date1 = new Date(date);
                  this.fromDate = date1.getFullYear() + '-' + String((date1.getMonth() + 1)).padStart(2, '0') + '-' + String(date1.getDate()).padStart(2, '0')
                  this.toDate = date1.getFullYear() + '-' + String((date1.getMonth() + 1)).padStart(2, '0') + '-' + String(date1.getDate()).padStart(2, '0')
                },
                onClose: (date: any) => {
                  console.log(date)
                  if (date != "") {
                    this.updatingCustomerDashboardData = true;
                    this.getCustomerDashboardata();
                  }
                }
              });
            }, 1000);
          }
        }).catch((err) => {
          console.log("err", err)
          this.updatingCustomerDashboardData = false;
          this.customerDashboardDataLoading = false;
        });
    }
  }

  goToSummaryDetails(status: string) {

    let statusIndex = this.customerStatus?.findIndex((stat: any) => stat.status_title == status)
    if (statusIndex !== -1) {
      this.router.navigate(["customer-summary-details", this.customerStatus[statusIndex].status_id])
    }
    if(status === "Total"){
      this.router.navigate(["customer-summary-details", 0])
    }
    if(status === "newLead" || status === "totalLead"){
      this.router.navigate(["customer-summary-details", status])
    }
  }

}
