import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

declare var $: any;

register();

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  goToLogin(): void {
    localStorage.setItem('skipWelcome', "true");
    this.router.navigateByUrl('login');
  }

  ngAfterViewInit() {
    $("swiper-container").css("height", $(window).height());
  }
}
