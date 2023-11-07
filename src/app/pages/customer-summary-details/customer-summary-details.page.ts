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
      this.getLeadListByStatus(this.SelectedStatus);
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
  onSearchLead(event) {
    var str = event.detail.value;
    if (str) {
      let arrdata = this.LeadSearchArray;
      let x = arrdata.filter((a) => a.req_name.toUpperCase().includes(str.toUpperCase()));
      this.leadsListing = x;
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
  changeSegment(event:any){
    this.leadsListing= []
    console.log(event.detail.value);
    this.SelectedStatus = event.detail.value;
    this.getLeadListByStatus(this.SelectedStatus);
  }
  ChangeFilter(event:any){
    console.log(event.detail.value);
    this.filterDate = event.detail.value;
    this.getLeadListByStatus(this.SelectedStatus);
  }
  gotoLeadDetailsEdit(customer){
    this._nav.navigateForward("/edit-customer-details",{queryParams:{customer:customer}})
  }
}
