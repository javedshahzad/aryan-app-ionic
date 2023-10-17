import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { FcmService } from 'src/app/services/fcm.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class HomePage implements OnInit {
  
  userData: any;
  attendance_action = '';
  attendance_loading: boolean = false;
  displayProfileCompletion: boolean = false;
  bannerImage: string = "";
  PUSH_TOKEN="pushToken"
  constructor(
    private router: Router,
    private dataService: DataService,
    private commonService: CommonService,
    private fcmSr:FcmService
    ) { }

  ngOnInit() {
    this.userData = this.dataService.getUserData();
    this.displayProfileCompletion = false;
    if(!this.userData['first_name'] || !this.userData['last_name'] || !this.userData['admin_email'] || !this.userData['phone'] || !this.userData['address']) {
      this.displayProfileCompletion = true;
    }
    this.dataService.validateJWTToken({user_id: this.userData['user_id']}).then((tokenResponse) => {
      const response = JSON.parse(tokenResponse.data);
      if(!response['keep_login']) {
        // localStorage.clear();
        // this.router.navigate(['/login']);
        var loginRequest = JSON.parse(localStorage.getItem('loginRequest'));
        loginRequest['fcm_token'] = this.fcmSr.PUST_TOKEN_FOR_LOGIN ? this.fcmSr.PUST_TOKEN_FOR_LOGIN :  localStorage.getItem(this.PUSH_TOKEN);;
        this.dataService.userLogin(loginRequest).then((resp: any) => {
          const response = JSON.parse(resp.data);
          localStorage.setItem('aryanUser', JSON.stringify(response.data));
          this.attendance_loading = true;
          this.getDashboardData();
          this.getBannerImage();
      })
      } else {
        this.attendance_loading = true;
        this.getDashboardData();
        this.getBannerImage();
      }
    })
  }

  private getDashboardData(fromDate = undefined, toDate = undefined): void {
    let user = localStorage.getItem('aryanUser');
    if (user) {
      let data = {
        user_id: JSON.parse(user).user_id,
        login_type: JSON.parse(user).login_type,
        to_date: toDate ? toDate : '',
        from_date: fromDate ? fromDate : ''
      }
      this.dataService.getUserDashboard(data)
        .then((resp: any) => {
          this.attendance_loading = false;
          const response = JSON.parse(resp.data);
          console.log(response);
          this.attendance_action = response.data.attendance_action;
/*          this.totalAssignData = response.data.section_1.today_inquiry.total_assign_data;
          this.totalCalledData = response.data.section_1.today_inquiry.total_called_data;
          this.totalPendingCalls = response.data.section_1.today_inquiry.total_pending_calls;
          this.totalSalesClosed = response.data.section_1.today_inquiry.total_sales_closed;
          this.totalTicketClosed = response.data.section_1.today_inquiry.total_ticket_closed;
          this.totalTicketOpen = response.data.section_1.today_inquiry.total_ticket_open;
          this.totalTicketRaised = response.data.section_1.today_inquiry.total_ticket_raised;
          this.callSummaryData = response.data.section_2.call_summary;
          this.section2 = response.data.section_2.today_inquiry;
          this.productAssigns = response.data.section_1.product_assign.map(e => {
            return {
              productName: e.product_name,
              todayInquiry: e.today_inquiry,
              totalMonthlySummary: e.total_monthly_summary,
            }
          })
          this.productCalling = response.data.section_1.product_assign.map(e => {
            return {
              productName: e.product_name,
              todayInquiry: e.today_inquiry,
              totalMonthlySummary: e.total_monthly_summary,
            }
          }) */
        }).catch((err) => {
        });
    }
  }

  checkInOut(): void {
    let data = { "user_id": this.userData.user_id, attendance_action: this.attendance_action };
    this.attendance_loading = true;
    this.dataService.userCheckInOut(data)
      .then((resp: any) => {
        const response = JSON.parse(resp.data);
        if (response.status_code == 200) {
          if (this.attendance_action == 'check-in') { 
            this.attendance_action = 'check-out'; 
          } else if (this.attendance_action == 'check-out') { 
            this.attendance_action = 'check-in'; 
          }
          this.commonService.presentToast('success', response.message);
        } else {
          this.commonService.presentToast('warning', response.message);
        }
        this.attendance_loading = false;
      }).catch((err) => {
        this.commonService.presentToast('danger', err.message);
        this.attendance_loading = false;
      });
  }

  getBannerImage(): void {
    this.dataService.getBannerImage().then((resp: any) => {
      const response = JSON.parse(resp.data);
      this.bannerImage = response['data']['project_banner']
    });
  }
  
  ngAfterViewInit() {

    $(document).ready(function () {

      $(".carousel-fullscreen.carousel-slider").carousel({
        fullWidth: true,
        indicators: true
      });

    });
  }
}
