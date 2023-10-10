import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-edit-customer-details',
  templateUrl: './edit-customer-details.page.html',
  styleUrls: ['./edit-customer-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditCustomerDetailsPage implements OnInit {
  selectedCustomer: any;
  customerStatus: any = [];
  userData: any;
  projectList: any=[];
  loading: boolean=false;
  note:any;
  assignedProject:any;
  statusChange:any;
  status: any;
  lead_id: any;
  response: any;
  isModalOpen = false;
  AllNotes: any=[];
  addnotes:boolean=false;
  constructor(
     private commonService: CommonService,
    public dataService: DataService,
    private _nav:NavController,
    private activeRoute:ActivatedRoute,
    private router: Router
    ) {
      this.activeRoute.queryParams.subscribe((response:any)=>{
        this.response = response.customer;
        console.log(this.selectedCustomer)
   
      })
     }

  ngOnInit() {
    this.selectedCustomer=this.response
    this.userData = this.dataService.getUserData();
    console.log(this.userData)
    this.getCustomerStatusdata();
    this.getProjectList();
  }
  getCustomerStatusdata(): void {

    this.dataService.getCustomerStatus({})
      .then((resp: any) => {
        let customerStatusData = JSON.parse(resp.data);
        console.log(customerStatusData)
        this.customerStatus = customerStatusData?.data;
        this.customerStatus = this.customerStatus.filter((a:any)=> a.status_title != "Busy");
        console.log(this.customerStatus);
        this.statusChange = this.selectedCustomer.req_call_status;
        this.assignedProject= this.selectedCustomer.rep_product_id;
        this.lead_id = this.selectedCustomer.req_id;
        let statusIndex = this.customerStatus?.findIndex((stat: any) => stat.status_id == this.selectedCustomer.req_call_status)
        this.status =  this.customerStatus[statusIndex].status_title;
      })
  }
  getProjectList(): void {
    let data: any = {
      user_id: this.userData.user_id,
      login_type: String(this.userData.login_type),
    }
    console.log(data)
    this.dataService.getProjectList(data)
      .then((resp: any) => {
        console.log("project list", resp)
        const response = JSON.parse(resp.data);
        this.projectList = JSON.parse(JSON.stringify(response.data));
        
      }).catch((err) => {
        console.log(err)
      });
  }
  changeStatus(){

  }
  gotoScheduleEvent(customer:any){
    console.log(customer)
    this._nav.navigateForward("/schedule-event",{queryParams:{customer:customer}})
  }
  gotoEditDetails(customer:any){
    console.log(customer)
    this._nav.navigateForward("/add-customer",{queryParams:{customer:customer}})
  }
  updatelead(): void {
      this.loading = true;
      let apiData={};
      this. userData = this.dataService.getUserData();
      apiData["user_id"] = this.userData.id;
      apiData["login_type"] = String(this.userData.login_type);
      apiData["lead_id"] = this.lead_id;
      apiData["c_lead_status"] = this.statusChange;
      apiData["c_project_id"] = this.assignedProject;
      console.log(apiData)
      this.dataService.updateLead(apiData)
        .then((resp: any) => {
          console.log("resp", resp)
          const response = JSON.parse(resp.data);
          if (response.status_code == 201) {
            this.commonService.presentToast('warning', response.message);
          } else { 
            this.commonService.presentToast('success', response.message); 
            this.router.navigate(["customer-summary-details", this.statusChange]);
          }
          this.loading = false;
        }).catch((err) => {
          console.log("err", err)
          this.loading = false;
        });
  }
  Addnewnote(): void {
    this.addnotes = true;
    let apiData={};
    this. userData = this.dataService.getUserData();
    apiData["user_id"] = this.userData.id;
    apiData["login_type"] = String(this.userData.login_type);
    apiData["lead_id"] = this.lead_id;
    apiData["note_msg"] =this.note;
    console.log(apiData)
    this.dataService.addNewNotes(apiData)
      .then((resp: any) => {
        console.log("resp", resp)
        const response = JSON.parse(resp.data);
        if (response.status_code == 201) {
          this.commonService.presentToast('warning', response.message);
        } else { 
          this.commonService.presentToast('success', response.message); 
          this.note="";
        }
        this.addnotes = false;
      }).catch((err) => {
        console.log("err", err)
        this.addnotes = false;
      });
}
setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
  if(this.isModalOpen){
    this.GetAllNotes();
  }
}
GetAllNotes(): void {
  let apiData={};
  apiData["user_id"] = this.userData.id;
  apiData["login_type"] = String(this.userData.login_type);
  apiData["lead_id"] = this.lead_id;
  console.log(apiData)
  this.dataService.getAllNotes(apiData)
    .then((resp: any) => {
      console.log("resp", resp)
      let notesData = JSON.parse(resp.data);
      console.log(notesData)
      this.AllNotes=notesData.data;
      console.log(this.AllNotes)
    }).catch((err) => {
      console.log("err", err)
    });
}
}
