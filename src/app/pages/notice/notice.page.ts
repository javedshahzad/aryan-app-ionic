import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NoticePage implements OnInit {
  
  currentTab: string = "userNotice";

  userData: any;
  isNoticeDataLoading: boolean = false;
  noticeData: any[] = [];
  groupNoticeData: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.userData = this.dataService.getUserData();
    this.getNoticeData();
  }

  getNoticeData(): void {
    this.isNoticeDataLoading = true;
    let data = {
      user_id: this.userData.user_id,
      login_type: this.userData.login_type
    }
    this.dataService.getUserNotice(data)
      .then((resp: any) => {
        console.log("Notice:",JSON.parse(resp.data));
        const response = JSON.parse(resp.data);
        this.noticeData = response.data;
        this.isNoticeDataLoading = false;
      }).catch(() => {
        this.isNoticeDataLoading = false;
      });

      this.dataService.getUserGroupNotice(data)
      .then((resp: any) => {
        console.log("Notice group:",JSON.parse(resp.data));
        const response = JSON.parse(resp.data);
        this.groupNoticeData = response.data;
        this.isNoticeDataLoading = false;
      }).catch(() => {
        this.isNoticeDataLoading = false;
      });
  }

}
