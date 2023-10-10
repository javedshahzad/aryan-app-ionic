import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private toastController: ToastController,
  ) { }

  async presentToast(clr: string, msg: string): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      color: clr,
      position: 'top',
      duration: 4000
    });
    toast.present();
  }

}
