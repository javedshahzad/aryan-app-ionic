import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-schedule-event',
  templateUrl: './schedule-event.page.html',
  styleUrls: ['./schedule-event.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ScheduleEventPage implements OnInit {

  event_type: string = "follow_up";

  loading: boolean = false;
  scheduleEventForm!: FormGroup;
  optionsDatLaoding: boolean = false;
  customerOptions: any[] = [];
  selectedCustomer: any="";
  searchValue: any="";
  showCustomers: boolean=false;
  customerData: any="";

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
    this.scheduleEventForm = this.fb.group({
      customer_name: ['', [Validators.required]],
      event_type: ['follow_up', [Validators.required]],
      event_date: ['', [Validators.required]],
      event_time: ['', [Validators.required]],
      event_notes: ['', [Validators.required]]
    });
    if(this.selectedCustomer){
      this.scheduleEventForm.controls['customer_name'].setValue(this.selectedCustomer.req_name ? this.selectedCustomer.req_name : this.selectedCustomer.user_first_name + "" + this.selectedCustomer.user_last_name);
    }
    
  }

  eventTypeChanged(event_type: string): void {
    this.event_type = event_type;
    this.scheduleEventForm.controls['event_type'].setValue(event_type);
    this.scheduleEventForm.controls['event_type'].updateValueAndValidity();
  }

  public getCustomerFieldOptionsData(): void {

    let userData = this.dataService.getUserData();

    this.optionsDatLaoding = true;
    let data = {
      user_id: userData.id
    }   
    this.dataService.simpleLoader();
    this.dataService.getCustomerList(data).then((resp: any) => {
      
      const response = JSON.parse(resp.data);
      console.log("customer list", response)
      this.dataService.loaderDismiss();
      this.customerOptions = response.data;
      let autoCompleteData: any = {};
      this.customerOptions.forEach((customer: any) => {
        let customer_name: string = customer.user_first_name;
        autoCompleteData[customer_name] = customer['user_id'];
      })
      setTimeout(() => {
        $('input.autocomplete').autocomplete({
          data: autoCompleteData,
          onAutocomplete: (event:any) => {
            console.log(event)
            this.scheduleEventForm.controls['customer_name'].setValue(event);
            this.scheduleEventForm.controls['customer_name'].updateValueAndValidity();
          }
        });
      }, 1000);

      this.optionsDatLaoding = false;
    }).catch((err: any) => {
      console.log(err)
      this.dataService.loaderDismiss();
      this.optionsDatLaoding = false;
    });
  }
  public SearchCustomer(event:any) {

    let userData = this.dataService.getUserData();
    this.searchValue = event;
    if(this.searchValue){
      let data = {
        user_id: userData.id,
        search:this.searchValue
      }   
      this.dataService.searchCustomer(data).then((resp: any) => {
        
        const response = JSON.parse(resp.data);
        console.log("customer list", response)
        this.customerOptions = response.data;
        console.log(this.customerOptions)
        if(this.customerOptions.length > 0){
          this.showCustomers = true;
        }else{
          this.showCustomers = false;
        }
        if(!this.searchValue){
          this.showCustomers = false;
        }
      }).catch((err: any) => {
        console.log(err)
        this.dataService.loaderDismiss();
      });
    }else{
      this.showCustomers = false;
    }
    console.log( this.searchValue)
    
  }
  onSelectCustomer(data){
    this.customerData = data;
      this.scheduleEventForm.controls['customer_name'].setValue(data.req_name);
      setTimeout(() => {
        this.showCustomers = false;
      }, 3000);
      console.log(this.customerData)
  }
  saveScheduleEvent(): void {

    console.log(this.scheduleEventForm.value)

    if (this.scheduleEventForm.valid) {
      this.loading = true;

      let apiData = this.scheduleEventForm.value;
      let selected_customer_index = this.customerOptions.findIndex((customer: any) => customer.req_name == this.scheduleEventForm.value['customer_name'])
      apiData['user_id'] = this.dataService.getUserData().user_id;
      apiData['login_type'] = this.dataService.getUserData().login_type;
      if(selected_customer_index !== -1) {
        apiData['lead_id'] = this.customerOptions[selected_customer_index]['req_id']
      }
      if(this.selectedCustomer){
        apiData['lead_id'] = this.selectedCustomer['req_id'] ? this.selectedCustomer['req_id'] : this.selectedCustomer['id']
      }
      console.log(apiData)
      this.dataService.saveScheduleEvent(apiData)
        .then((resp: any) => {
          console.log("resp", resp)
          // console.log("Parse resp", JSON.parse(resp))
          this.scheduleEventForm.reset();
          const response = JSON.parse(resp.data);
          console.log(response)
          if (response.status_code == 201) {
            this.commonService.presentToast('warning', response.message);
          } else { this.commonService.presentToast('success', "Event created successfully!"); 
          this.scheduleEventForm.controls['customer_name'].enable();
          this._nav.back();
        }
          this.loading = false;
        }).catch((err) => {
          console.log("err", err)
          this.loading = false;
        });

    }else{
      this.commonService.presentToast('warning', "Pleas fill all details!");
    }
  }

  ngAfterViewInit() {
    $(".datepicker").datepicker({
      onSelect: (date: any) => {
        if (date != "") {
          let date1 = new Date(date);
          this.scheduleEventForm.controls['event_date'].setValue(date1.getFullYear() + '-' + String((date1.getMonth() + 1)).padStart(2, '0') + '-' + String(date1.getDate()).padStart(2, '0'));
          this.scheduleEventForm.controls['event_date'].updateValueAndValidity();
        }
      }
    });
    $(".timepicker").timepicker({
      onSelect: (hour: any, minutes: any) => {
        if (hour && minutes) {
          this.scheduleEventForm.controls['event_time'].setValue(String(hour).padStart(2, '0') + ':' + String(minutes).padStart(2, '0'));
          this.scheduleEventForm.controls['event_time'].updateValueAndValidity();
        }
      }
    });
  }
  ionViewWillLeave(){
    this.selectedCustomer=""
  }
}
