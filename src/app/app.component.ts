import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { DataService } from './services/data.service';
import { register } from 'swiper/element/bundle';
import { FcmService } from './services/fcm.service';
import { SplashScreen } from '@capacitor/splash-screen';
declare var $: any;
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class AppComponent implements OnInit {

  hideSlideMenuAndFooterPages: string[] = ["/login", "/welcome", "/forgot-password"];
  userData: any;
  constructor(public route: Router,
     private dataService: DataService, 
     private platform:Platform,
     private fcmSr:FcmService,
    
    ) {
    this.userData = this.dataService.getUserData()
  }
  ngOnInit(): void {
    this.initApp();
  }
 async initApp() {
    this.platform.ready().then(async () => {
      this.fcmSr.initPush();
      this.checkLoginStatus();
      // Hide the splash (you should do this on app launch)
      await SplashScreen.hide();
    });
  }
  closeMenu() {
    $(".sidenav-overlay").click()
  }
  checkLoginStatus(): any{
    let skipWelcome =  localStorage.getItem('skipWelcome') ? localStorage.getItem('skipWelcome') : "false";
    console.log(skipWelcome)
    if (!localStorage.getItem('aryanUser') && skipWelcome != "true") {
      this.route.navigate(['/welcome']);
      return false;
    }
     else if(!localStorage.getItem('aryanUser') && skipWelcome == "true") {
      this.route.navigate(['/login'])
        return false;
      }else if (localStorage.getItem('aryanUser') && skipWelcome == "true"){
        this.route.navigate(['/home'])
        return true;
      }
  }
}
