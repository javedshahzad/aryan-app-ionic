import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.page.html',
  styleUrls: ['./notification-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NotificationListPage implements OnInit {

  userData: any;
  notificationData: any[] = [];
  notificationDataLoading: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userData = this.dataService.getUserData();
    this.getNotificationData();
  }

  getNotificationData(): void {
    this.notificationDataLoading = true;
    let data = {
      user_id: this.userData.user_id,
      login_type: this.userData.login_type
    }
    this.dataService.getCallbackReminderList(data)
      .then((resp: any) => {
        this.notificationDataLoading = false;
        const response = JSON.parse(resp.data);
        console.log("notification list", response)
        this.notificationData = response.data;
      }).catch(() => {
        this.notificationDataLoading = false;
      });
  }

  timeSince(date: string): string {

    let currentDate: any = new Date();
    let convertedDate: any = new Date(date);
    let seconds = Math.floor((currentDate - convertedDate) / 1000);
  
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

}
