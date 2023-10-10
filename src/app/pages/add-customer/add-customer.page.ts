import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddCustomerPage implements OnInit {

  addCustomerForm!: FormGroup;
  loading: boolean = false;

  propertyLocationOptions: string[] = [];
  budgetOptions: string[] = [];
  unitTypeOptions: string[] = [];
  propertyStatusOptions: string[] = [];

  optionsDatLaoding: boolean = false;
  selectedCustomer: any='';
  constructor(
    private commonService: CommonService,
    public dataService: DataService,
    private fb: FormBuilder,
    private activeRoute:ActivatedRoute,
    private _nav:NavController
    ) {
      this.activeRoute.queryParams.subscribe((response:any)=>{
        this.selectedCustomer=response.customer;
        console.log(this.selectedCustomer)
      })
     }

  ngOnInit() {
    this.loading = false;
    this.getFieldOptionsData();

    this.addCustomerForm = this.fb.group({
      c_name: ['', ],
      c_email: ['', ],
      c_phone: ['', ],
      c_project_location: ['', []],
      c_min_budget: ['', ],
      c_max_budget: ['', ],
      c_unit_type: ['', ],
      c_property_status: ['', ]
    });
    if(this.selectedCustomer){
      this.addCustomerForm.controls['c_name'].setValue(this.selectedCustomer?.req_name);
      this.addCustomerForm.controls['c_email'].setValue(this.selectedCustomer?.req_email);
      this.addCustomerForm.controls['c_phone'].setValue(this.selectedCustomer?.req_phone);
      this.addCustomerForm.controls['c_project_location'].setValue(this.selectedCustomer?.rep_product_location);
      this.addCustomerForm.controls['c_min_budget'].setValue(this.selectedCustomer?.rep_min_budget);
      this.addCustomerForm.controls['c_max_budget'].setValue(this.selectedCustomer?.rep_max_budget);
      this.addCustomerForm.controls['c_unit_type'].setValue(this.selectedCustomer?.rep_unit_type);
      this.addCustomerForm.controls['c_property_status'].setValue(this.selectedCustomer?.rep_property_status);
      if(this.selectedCustomer.req_phone){
        this.addCustomerForm.controls['c_phone'].disable();
      }
    }
  }

  private getFieldOptionsData(): void {

    this.optionsDatLaoding = true;

    const propertyLocationDataPromise = this.dataService.getPropertyLocationOptionList()
    const budgetDataPromise = this.dataService.getBudgetOptionList()
    const unitTypeDataPromise = this.dataService.getUnitTypeOptionList()
    const propertyStatusDataPromise = this.dataService.getPropertyStatusOptionList()

    Promise.all([propertyLocationDataPromise, budgetDataPromise, unitTypeDataPromise, propertyStatusDataPromise])
    .then((resp: any) => {
      console.log(resp)

      this.propertyLocationOptions = JSON.parse(resp[0].data)?.data || [];
      this.budgetOptions = JSON.parse(resp[1].data)?.data || [];
      this.unitTypeOptions = JSON.parse(resp[2].data)?.data || [];
      this.propertyStatusOptions = JSON.parse(resp[3].data)?.data || [];

      console.log(this.propertyLocationOptions, this.budgetOptions, this.unitTypeOptions, this.propertyStatusOptions)
      setTimeout(() => {
        $("select").formSelect();
      }, 1000);

      this.optionsDatLaoding = false;
    }).catch((err: any) => {
      console.log(err)
      this.optionsDatLaoding = false;
    });
  }

  saveCustomer(): void {
    console.log(this.addCustomerForm.value)

    if (this.addCustomerForm.valid) {
      this.loading = true;

      let apiData = this.addCustomerForm.value;
      let userData = this.dataService.getUserData()
      apiData["user_id"] = userData['id'];
      apiData["login_type"] = userData['login_type'];
      apiData["customer_name"] = this.addCustomerForm.value.c_name;
      this.dataService.addCustomer(apiData)
        .then((resp: any) => {
          console.log("resp", resp)
          this.addCustomerForm.reset();
          const response = JSON.parse(resp.data);
          if (response.status_code == 201) {
            this.commonService.presentToast('warning', response.message);
          } else {
             this.commonService.presentToast('success', response.message);
             this._nav.back();
         }
          this.loading = false;
        }).catch((err) => {
          console.log("err", err)
          this.loading = false;
        });

    }

  }
  UpdateCustomer(){
    console.log(this.addCustomerForm.value)

    if (this.addCustomerForm.valid) {
      this.loading = true;

      let apiData = this.addCustomerForm.value;
      let userData = this.dataService.getUserData()
      apiData["user_id"] = userData['id'];
      apiData["lead_id"] = this.selectedCustomer.req_id;
      apiData["login_type"] = userData['login_type'];
      apiData["customer_name"] = this.addCustomerForm.value.c_name;
      console.log(apiData)
      this.dataService.updateLead(apiData)
        .then((resp: any) => {
          console.log("resp", resp)
          this.addCustomerForm.reset();
          const response = JSON.parse(resp.data);
          if (response.status_code == 201) {
            this.commonService.presentToast('warning', response.message);
          } else { 
          this.commonService.presentToast('success', response.message); 
          this._nav.back();
        }
          this.loading = false;
        }).catch((err) => {
          console.log("err", err)
          this.loading = false;
        });

    }

  }
}
