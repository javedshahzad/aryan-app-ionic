import { Injectable } from '@angular/core';
import {
  Capacitor
} from '@capacitor/core';
import { Router } from '@angular/router';

import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { BehaviorSubject, Observable } from 'rxjs';
import { FCM } from '@capacitor-community/fcm';
import { AlertController, NavController } from '@ionic/angular';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class FcmService {
  PUSH_TOKEN="pushToken"
  public isupdatePushMessage = new BehaviorSubject(true);
  PUST_TOKEN_FOR_LOGIN:any="";
  ReceivedNotificationData: any;
  constructor(private router: Router,
    private alertController: AlertController,
    public dataService: DataService,
    public _nav:NavController
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
            this.ReceivedNotificationData = ReceivedNotification
            console.log(this.ReceivedNotificationData)
            let msg = this.ReceivedNotificationData.body ?  this.ReceivedNotificationData.body :  this.ReceivedNotificationData.data.body;
            let title =  this.ReceivedNotificationData.title ?  this.ReceivedNotificationData.title :  this.ReceivedNotificationData.data.title
            this.presentAlert(msg,title, this.ReceivedNotificationData);
          }
        );
    
        PushNotifications.addListener(
          'pushNotificationActionPerformed',
          async (notification: ActionPerformed) => {
            console.log(notification,"Action performed")
            const data = notification.notification;
            console.log(data)
            if(data.data?.data_id){
              this.HandleEvent(data)
            }else{
              this.HandleEvent(this.ReceivedNotificationData )
            }
            this.alertController.dismiss();
          }
        );
      } else {
        // No permission for push granted
      }
    });
  }
  
  async presentAlert(msg,title,Notification) {
    const alert = await this.alertController.create({
      header: title,
      message:msg,
      mode:"ios",
      buttons: [
        {
          text: 'Okay!',
          handler: () => {
            console.log('Okay clicked');
            this.HandleEvent(Notification)
          }
        },
      ],
    });

    await alert.present();
  }
  HandleEvent(ReceivedNotificationData){
    if(ReceivedNotificationData.data.type === "lead"){
      let id = ReceivedNotificationData.data.data_id
      this.dataService.GetLeadbyID(id).then((response)=>{
        console.log("GetLeadbyID = ", response);
        const responseData = JSON.parse(response.data);
        console.log(responseData)
        const data = responseData.data;
        this._nav.navigateForward("/update-lead",{queryParams:{customer:data}})
      }).catch((err) => {
        console.log(err)
      });
    }else if(ReceivedNotificationData.data.type === "call"){
      let id = ReceivedNotificationData.data.data_id
      this.dataService.GetCallByID(id).then((response)=>{
        console.log("GetCallByID = ", response);
        const responseData = JSON.parse(response.data);
        console.log(responseData)
        const data = responseData.data;
        this._nav.navigateForward("/edit-customer-details",{queryParams:{customer:data}})
      }).catch((err) => {
        console.log(err)
      });
    }
  }
}