import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-customer-summary-details',
  templateUrl: './customer-summary-details.page.html',
  styleUrls: ['./customer-summary-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerSummaryDetailsPage implements OnInit {

  userData: any;
  leadsListing: any[] = [];
  leadsDataLoading: boolean = false;
  SelectedStatus: any;
  customerStatus: any=[];
  filterDate:any="1";
  searchLead:any=""
  LeadSearchArray: any=[];
  ShowHideNewLead:boolean=false;
  LimitData:any=20;
  constructor(
    private dataService: DataService,
    private activateRouter: ActivatedRoute,
    private _nav:NavController
  ) { }
  ionViewWillEnter(){
    this.userData = this.dataService.getUserData();

    this.activateRouter.params.subscribe((params: any) => {
      console.log("params", params)
      this.SelectedStatus = params.status;
      this.getCustomerStatusdata();
      if(this.SelectedStatus === "newLead" || this.SelectedStatus === "totalLead"){
        this.getNewLeadData(this.SelectedStatus)
        this.ShowHideNewLead = true;
      }else{
        this.getLeadListByStatus(this.SelectedStatus);
        this.ShowHideNewLead = false;
      }
   
    })
  }
  ngOnInit() {

  }

  getLeadListByStatus(status: string): void {
    this.leadsDataLoading = true;
    let data = {
      user_id: this.userData.id,
      status: status,
      from:this.filterDate,
      limit:String(this.LimitData)
    }
    console.log(data)
    this.dataService.getLeadsList(data)
      .then((resp: any) => {
        console.log(resp)
        this.leadsDataLoading = false;
        const response = JSON.parse(resp.data);
        console.log("get-lead-list", response)
        this.leadsListing = response.data;
        this.LeadSearchArray = response.data;
      }).catch((err:any) => {
        console.log((err))
        this.leadsDataLoading = false;
      });
  }
  getNewLeadData(status: string): void {
    this.leadsDataLoading = true;
    let data = {
      user_id: this.userData.id,
      lead_type:status,
      from:this.filterDate,
      limit:String(this.LimitData)
    }
    console.log(data)
    this.dataService.getNewLeadData(data)
      .then((resp: any) => {
        console.log(resp)
        this.leadsDataLoading = false;
        const response = JSON.parse(resp.data);
        console.log("get-lead-list New", response)
        this.leadsListing = response.data;
        console.log( this.leadsListing)
        this.LeadSearchArray = response.data;
      }).catch((err:any) => {
        console.log((err))
        this.leadsDataLoading = false;
      });
  }
  onSearchLead(event) {
    var str = event.detail.value;
    if (str) {
      let arrdata = this.LeadSearchArray;
      if(this.SelectedStatus === "newLead" || this.SelectedStatus === "totalLead"){
        let x = arrdata.filter((a) => a.user_first_name.toUpperCase().includes(str.toUpperCase()) || a.user_last_name.toUpperCase().includes(str.toUpperCase()));
        this.leadsListing = x;
      }else{
        let x = arrdata.filter((a) => a.req_name.toUpperCase().includes(str.toUpperCase()));
        this.leadsListing = x;
      }
  } else {
      this.leadsListing = this.LeadSearchArray;
  }
  }
   getCustomerStatusdata(): void {
    this.dataService.getCustomerStatus({})
      .then((resp: any) => {
        let customerStatusData = JSON.parse(resp.data);
        console.log(customerStatusData)
        this.customerStatus = customerStatusData?.data;
        this.customerStatus = this.customerStatus.filter((a:any)=> a.status_title != "Busy");
        console.log(this.customerStatus);

      })

  }
  gotoScheduleEvent(customer:any){
    console.log(customer)
    this._nav.navigateForward("/schedule-event",{queryParams:{customer:customer}});
  }
  OnStatusChange(event:any){
    this.leadsListing= []
    console.log(event.detail.value);
    this.SelectedStatus = event.detail.value;
    this.LimitData = 20;
    if(this.SelectedStatus === "newLead" || this.SelectedStatus === "totalLead"){
      this.ShowHideNewLead = true;
      this.getNewLeadData(this.SelectedStatus)
    }else{
      this.ShowHideNewLead = false;
      this.getLeadListByStatus(this.SelectedStatus);
    }
  }
  ChangeFilter(event:any){
    console.log(event.detail.value);
    this.filterDate = event.detail.value;
    this.LimitData = 20;
    if(this.SelectedStatus === "newLead" || this.SelectedStatus === "totalLead"){
      this.getNewLeadData(this.SelectedStatus);
      this.ShowHideNewLead = true;
    }else{
      this.getLeadListByStatus(this.SelectedStatus);
      this.ShowHideNewLead = false;
    }
  }
  gotoLeadDetailsEdit(customer){
    this._nav.navigateForward("/edit-customer-details",{queryParams:{customer:customer}})
  }
  gotoEditDetails(customer:any){
    console.log(customer)
    this._nav.navigateForward("/update-lead",{queryParams:{customer:customer}})
  }
  loadData(event) {
      console.log('Done');
      this.LimitData +=20;
      console.log(this.LimitData)
      if(this.SelectedStatus === "newLead" || this.SelectedStatus === "totalLead"){
        let data = {
          user_id: this.userData.id,
          lead_type:this.SelectedStatus,
          from:this.filterDate,
          limit:String(this.LimitData)
        }
        console.log(data)
        this.dataService.getNewLeadData(data)
          .then((resp: any) => {
            console.log(resp)
            event.target.complete();
            const response = JSON.parse(resp.data);
            console.log("get-lead-list New", response)
            this.leadsListing = response.data;
            console.log( this.leadsListing)
            this.LeadSearchArray = response.data;
          }).catch((err:any) => {
            console.log((err))
            event.target.complete();
          });
        this.ShowHideNewLead = true;
      }else{
        let data = {
          user_id: this.userData.id,
          status: this.SelectedStatus,
          from:this.filterDate,
          limit:String(this.LimitData)
        }
        console.log(data)
        this.dataService.getLeadsList(data)
          .then((resp: any) => {
            console.log(resp)
            const response = JSON.parse(resp.data);
            console.log("get-lead-list", response)
            this.leadsListing = response.data;
            this.LeadSearchArray = response.data;
            event.target.complete();
          }).catch((err:any) => {
            console.log((err))
            event.target.complete();
          });
        this.ShowHideNewLead = false;
      }
  }
}
