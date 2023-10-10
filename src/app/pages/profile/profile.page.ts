import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class ProfilePage implements OnInit {

  userData: any;
  profileForm!: FormGroup;
  loading: boolean = false;
  completion_percent: number = 0;
  deletingAccount: boolean = false;
  loggingOut: boolean = false;
  
  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private fb: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.userData = this.dataService.getUserData()

    this.profileForm = this.fb.group({
      first_name: ['', []],
      last_name: ['', []],
      email: ['', []],
      contact: ['', []],
      address: ['', []]
    });
    this.profileForm.valueChanges.subscribe((val) => {
      this.completion_percent = 0;
      if (val.first_name) {
        this.completion_percent += 20;
      }
      if (val.last_name) {
        this.completion_percent += 20;
      }
      if (val.email) {
        this.completion_percent += 20;
      }
      if (val.contact) {
        this.completion_percent += 20;
      }
      if (val.address) {
        this.completion_percent += 20;
      }
      console.log(val)
    });
  }

  async logout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Logout',
      // subHeader: 'Subtitle',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alertClass',
          id: 'cancel-button',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            this.loggingOut = true;
            this.dataService.logout({ user_id: this.userData.id }).then((resp: any) => {
              console.log(resp)
              this.loggingOut = false;
              const response = JSON.parse(resp.data);
              if (response.status_code == 201) {
                this.commonService.presentToast('warning', response.message);
              } else {
                this.commonService.presentToast('success', response.message);
                localStorage.clear();
                this.router.navigate(['/login']);

              }
            }).catch((e: any) => {
              this.loggingOut = false;
            })
          }
        }
      ]
    });
    await alert.present();
  }

  ngAfterViewInit() {

    this.profileForm.controls['first_name'].setValue(this.userData.first_name)
    this.profileForm.controls['last_name'].setValue(this.userData.last_name)
    this.profileForm.controls['email'].setValue(this.userData.admin_email)
    this.profileForm.controls['contact'].setValue(this.userData.phone)
    this.profileForm.controls['address'].setValue(this.userData.address)

    $("select").formSelect();
    $(".timepicker").timepicker();

    $(".datepicker").datepicker();
    $(".datepicker.datepicker1").datepicker({
      autoClose: true
    });

  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      let requestParams = this.profileForm.value;
      requestParams['user_id'] = this.userData.id
      this.loading = true;
      console.log(requestParams)
      this.dataService.updateUser(requestParams).then((resp: any) => {
        console.log(resp)
        this.loading = false;
        const response = JSON.parse(resp.data);
        if (response.status_code == 201) {
          this.commonService.presentToast('warning', response.message);
        } else {
          this.commonService.presentToast('success', response.message);
          let user_data: any = JSON.parse(JSON.stringify(this.userData));

          user_data['first_name'] = response['data']['first_name']
          user_data['last_name'] = response['data']['last_name']
          user_data['admin_email'] = response['data']['admin_email']
          user_data['phone'] = response['data']['phone']
          user_data['address'] = response['data']['address']

          localStorage.setItem('aryanUser', JSON.stringify(user_data));

        }
      }).catch((e: any) => {
        this.loading = false;
      })
    }
  }

  async confirmDeleteAccount() {
    const alert = await this.alertController.create({
      header: "Are you sure to delete your account?",
      subHeader: "Deleting your account will delete the all data forever and you will not be able to retrieve it once deleted.",
      buttons: [
        {
          text: 'I want to stay',
          role: 'cancel',
          handler: () => { },
        },
        {
          text: 'Delete my account',
          role: 'confirm',
          handler: () => {

            this.deletingAccount = true;
            this.dataService.deleteUser({ user_id: this.userData.user_id }).then((resp: any) => {
              console.log(resp)
              this.deletingAccount = false;
              const response = JSON.parse(resp.data);
              if (response.status_code == 201) {
                this.commonService.presentToast('warning', response.message);
              } else {
                this.commonService.presentToast('success', response.message);
                localStorage.clear();
                this.router.navigate(['/login']);

              }
            }).catch((e: any) => {
              this.deletingAccount = false;
            })

          },
        },
      ],
    })
    await alert.present();
  }

}
