import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DataService } from './services/data.service';
import { register } from 'swiper/element/bundle';
declare var $: any;
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class AppComponent {

  hideSlideMenuAndFooterPages: string[] = ["/login", "/welcome", "/forgot-password"];
  userData: any;
  constructor(public route: Router, private dataService: DataService) {
    this.userData = this.dataService.getUserData()
  }

  closeMenu() {
    $(".sidenav-overlay").click()
  }
}
