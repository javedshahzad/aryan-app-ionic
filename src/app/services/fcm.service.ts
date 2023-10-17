import { Injectable } from '@angular/core';
import {
  Capacitor
} from '@capacitor/core';
import { Router } from '@angular/router';

import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { BehaviorSubject, Observable } from 'rxjs';
import { FCM } from '@capacitor-community/fcm';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class FcmService {
  PUSH_TOKEN="pushToken"
  public isupdatePushMessage = new BehaviorSubject(true);
  PUST_TOKEN_FOR_LOGIN:any="";
  constructor(private router: Router,
    private alertController: AlertController
 ) { 
    }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }
  public async registerPush() {
    PushNotifications.requestPermissions().then((permission:any) => {
      if (permission.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        PushNotifications.addListener(
          'registration',
          async (token: Token) => {
            this.PUST_TOKEN_FOR_LOGIN=token.value;
            localStorage.setItem(this.PUSH_TOKEN,token.value);
            console.log('My token: ' + JSON.stringify(token));
            if (Capacitor.getPlatform() === 'ios') {
              const { token: fcm_token } = await FCM.getToken()
              this.PUST_TOKEN_FOR_LOGIN = fcm_token
            }
          }
        );
    
        PushNotifications.addListener('registrationError', (error: any) => {
          console.log('Error: ' + JSON.stringify(error));
        });
    
        PushNotifications.addListener(
          'pushNotificationReceived',
          async (ReceivedNotification: PushNotificationSchema) => {
            var ReceivedNotificationData = ReceivedNotification
            console.log(ReceivedNotificationData)
            this.presentAlert(ReceivedNotificationData.body ? ReceivedNotificationData.body : ReceivedNotificationData.data.body,ReceivedNotificationData.title ? ReceivedNotificationData.title : ReceivedNotificationData.data.title)
          }
        );
    
        PushNotifications.addListener(
          'pushNotificationActionPerformed',
          async (notification: ActionPerformed) => {
            console.log(notification,"Action performed")
            const data = notification;
            console.log(data)
          }
        );
      } else {
        // No permission for push granted
      }
    });
  }
  
  async presentAlert(msg,title) {
    const alert = await this.alertController.create({
      header: title,
      message:msg,
      mode:"ios",
      buttons: ['OK'],
    });

    await alert.present();
  }
}