import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.page.html',
  styleUrls: ['./customer-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CustomerListPage implements OnInit {

  userData: any;
  customerList: any[] = [];
  customerDataLoading: boolean = false;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.userData = this.dataService.getUserData();
    this.getCustomerList();
  }

  getCustomerList(): void {
    this.customerDataLoading = true;
    let data = {
      user_id: this.userData.id
    }
    this.dataService.getCustomerList(data)
      .then((resp: any) => {
        this.customerDataLoading = false;
        const response = JSON.parse(resp.data);
        console.log("customer list", response)
        this.customerList = response.data;
      }).catch(() => {
        this.customerDataLoading = true;
      });
  }

}
