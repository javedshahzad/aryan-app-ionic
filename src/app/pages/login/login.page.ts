import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';

import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { FcmService } from 'src/app/services/fcm.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loading: boolean = false;
  loginForm!: FormGroup;
  fcm_token: string = "";

  constructor(
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private platform: Platform,
    private fcmSr:FcmService
    ) { }
    //mohitjangra@aryanrealty.com
    //Shankar@4245
  ngOnInit() {
    this.fcm_token = this.fcmSr.PUST_TOKEN_FOR_LOGIN;
    this.loading = false;
    this.loginForm = this.fb.group({
			user_login: ['', [Validators.required, Validators.email]], //mohitjangra@aryanrealty.com
			user_password: ['', [Validators.required]] //Shankar@4245
		});
    if (Capacitor.getPlatform() !== 'web') {
      //this.getFcmToken();
    }
  }

  getFcmToken() {
    /*  FCM.getToken().then((token) => {
        console.log(token);
        this.userData.fcm_token = token.token;
      }); */
      PushNotifications.requestPermissions().then(() => {
        PushNotifications.register().then((token) => {
        /*   console.log(token);
          this.userData.fcm_token = token['token']; */
        });

      PushNotifications.addListener('registration', async ({ value }) => {
        let token = value;
        console.log(value); // Push token for Android
        this.fcm_token = token;
        // Get FCM token instead the APN one returned by Capacitor
        if (Capacitor.getPlatform() === 'ios') {
          const { token: fcm_token } = await FCM.getToken()
          token = fcm_token
        }
        // Work with FCM_TOKEN
      });
  });
}

  login(): void {
    console.log(this.loginForm.value)
    if(this.loginForm.valid) {
      this.fcm_token = this.fcmSr.PUST_TOKEN_FOR_LOGIN;
      var loginRequest = this.loginForm.value;
      loginRequest['fcm_token'] =  this.fcm_token ? this.fcm_token : "eadego-nig0:APA91bEtKx9hv50lmQmfzl-bSDdsZyTQ4RkelInfzxrPcZjJaSgDmok3-WQKV5FBu9hrMrkRrcCmf3arkGSviGltg5CyC2F9x1J2m0W7U8PxJ3Zlh7-_tL6VcFdb76hbaLIdZ-dOK15r";
      loginRequest['login_type'] = 1;
    
      this.loading = true;
      this.dataService.userLogin(loginRequest).then((resp: any) => {
        console.log(resp)
        this.loading = false;
        const response = JSON.parse(resp.data);
        if (response.status_code == 201) {
          this.commonService.presentToast('danger', response.message);
        } else {
          localStorage.setItem('aryanUser', JSON.stringify(response.data));
          setTimeout(() => {
            this.router.navigate(['/home']);
            localStorage.setItem('loginRequest', JSON.stringify(loginRequest));
            // window.location.reload();
          }, 1000);
        }        
      }).catch((e: any) => {
        this.loading = false;
      })
    }
  }

  ngAfterViewInit() {
    $(".content-area").css("height", $(window).height());
  }
}
