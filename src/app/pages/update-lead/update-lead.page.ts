import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectSearchModule } from 'mat-select-search';

declare var $: any;

@Component({
  selector: 'app-update-lead',
  templateUrl: './update-lead.page.html',
  styleUrls: ['./update-lead.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule,MatSelectModule,MatSelectSearchModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA]
})
export class UpdateLeadPage implements OnInit {
  selectedVal=""
  addCustomerForm!: FormGroup;
  loading: boolean = false;

  propertyLocationOptions: any = [];
  budgetOptions: any = [];
  unitTypeOptions: any = [];
  propertyStatusOptions: any = [];

  propertyOptsList: Record<string, string>[] = [];
  budgetList: Record<string, string>[] = [];
  unitTypeList: Record<string, string>[] = [];
  prpertyStatusList: Record<string, string>[] = [];
  optionsDatLaoding: boolean = false;
  selectedCustomer: any='';
  filteredProjects: Record<string, string>[] = [];
  projectList: any=[];
  userData: any;
  customerStatus: any = [];
  filteredStatus: Record<string, string>[] = [];
  event_type: string = "follow_up";
  CategoriesList: any=[];
  CategoriesTypesList: any=[];
  CategoriesListOptions: any = [];
  CategoriesTypesListOptions: any=[];
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
    this.userData = this.dataService.getUserData();
    this.loading = false;
    this.getFieldOptionsData();
    this.getCustomerStatusdata();
    this.getCategories();
    this.addCustomerForm = this.initForm();
 
  }
  initForm(){
    
      return this.fb.group({
        c_name: ['', ],
        c_email: ['', ],
        c_phone: ['', ],
        c_project_location: ['', []],
        c_min_budget: ['', ],
        c_max_budget: ['', ],
        c_unit_type: ['', ],
        c_property_status: ['', ],
        c_project_id: ['', []],
        c_status: ['', []],
        c_country_code:['+91',],
        event_type:[""],
        event_date:[""],
        event_time:[""],
        c_unit_sub_type:[""],
        c_notes:["",[]]
      });
  }
  ionViewWillEnter(){
    if(this.selectedCustomer){
      this.addCustomerForm.controls['c_name'].setValue(this.selectedCustomer?.user_first_name + this.selectedCustomer?.user_last_name);
      this.addCustomerForm.controls['c_email'].setValue(this.selectedCustomer?.user_email);
      this.addCustomerForm.controls['c_project_location'].setValue(this.selectedCustomer?.user_product_location);
      this.addCustomerForm.controls['c_min_budget'].setValue(this.selectedCustomer?.min_budget);
      this.addCustomerForm.controls['c_max_budget'].setValue(this.selectedCustomer?.max_budget);
      this.addCustomerForm.controls['c_unit_type'].setValue(this.selectedCustomer?.unit_type);
      this.addCustomerForm.controls['c_property_status'].setValue(this.selectedCustomer?.property_status);
      this.addCustomerForm.controls['c_unit_sub_type'].setValue(this.selectedCustomer?.unit_sub_type);
      
      if(this.selectedCustomer.user_phone){
        if(this.selectedCustomer.user_phone.slice(0,3) === "+91"){
          this.addCustomerForm.controls['c_phone'].setValue(this.selectedCustomer?.user_phone.slice(3));
          this.addCustomerForm.controls['c_country_code'].setValue(this.selectedCustomer?.user_phone.slice(0,3));
          this.addCustomerForm.controls['c_phone'].disable();
          this.addCustomerForm.controls['c_country_code'].disable();
        }else{
          this.addCustomerForm.controls['c_phone'].setValue(this.selectedCustomer?.user_phone);
          this.addCustomerForm.controls['c_phone'].disable();
        }
        this.addCustomerForm.controls['c_phone'].updateValueAndValidity();
        this.addCustomerForm.controls['c_country_code'].updateValueAndValidity();

      }
      if(this.selectedCustomer.unit_type === "Residential Project"){
        this.getCategoriesTypes("1");
      this.getProjectList("Residential Project");
      }else{
        this.getCategoriesTypes("2");
        this.getProjectList("Commercial Project");
      }
    }
  }
  eventTypeChanged(event_type: string): void {
    this.event_type = event_type;
    this.addCustomerForm.controls['event_type'].setValue(event_type);
    this.addCustomerForm.controls['event_type'].updateValueAndValidity();
  }
  getCategories(){
    this.dataService.Getprojectcategory().then((resp: any) => {
      console.log("getCategories list", resp);
      const response = JSON.parse(resp.data);
      this.CategoriesList = response.data;
      this.CategoriesListOptions = response.data;
      console.log("getCategories list",  this.CategoriesList)
    }).catch((err) => {
      console.log(err)
    });
  }
  onSelectCategory(event){
    let statusIndex = this.CategoriesList?.findIndex((stat: any) => stat.category == event.value)
    if (statusIndex !== -1) {
      this.getCategoriesTypes(this.CategoriesList[statusIndex].category_id);
      this.getProjectList(this.CategoriesList[statusIndex].category)
    }
  }
  getCategoriesTypes(id){
    this.dataService.Getprojecttype(id).then((resp: any) => {
      console.log("getCategories types list", resp)
      const response = JSON.parse(resp.data);
      this.CategoriesTypesList = response.data;
      this.CategoriesTypesListOptions = response.data;
      console.log("getCategories types list",this.CategoriesTypesList)
    }).catch((err) => {
      console.log(err)
    });
  }
  getProjectList(id): void {
    let data: any = {
      user_id: this.userData.id,
      login_type: String(this.userData.login_type),
      category:id
    }
    console.log(data)
    this.dataService.getProjectList(data)
      .then((resp: any) => {
        console.log("project list", resp)
        const response = JSON.parse(resp.data);
        console.log(response)
        this.projectList = JSON.parse(JSON.stringify(response.data));
        console.log(this.projectList)
        this.filteredProjects = this.projectList;
      }).catch((err) => {
        console.log(err)
      });
  }
  ngAfterViewInit() {
    $(".datepicker").datepicker({
      onSelect: (date: any) => {
        if (date != "") {
          let date1 = new Date(date);
          this.addCustomerForm.controls['event_date'].setValue(date1.getFullYear() + '-' + String((date1.getMonth() + 1)).padStart(2, '0') + '-' + String(date1.getDate()).padStart(2, '0'));
          this.addCustomerForm.controls['event_date'].updateValueAndValidity();
        }
      }
    });
    $(".timepicker").timepicker({
      onSelect: (hour: any, minutes: any) => {
        if (hour && minutes) {
          this.addCustomerForm.controls['event_time'].setValue(String(hour).padStart(2, '0') + ':' + String(minutes).padStart(2, '0'));
          this.addCustomerForm.controls['event_time'].updateValueAndValidity();
        }
      }
    });
  }
  getCustomerStatusdata(): void {

    this.dataService.getCustomerStatus({})
      .then((resp: any) => {
        let customerStatusData = JSON.parse(resp.data);
        console.log(customerStatusData)
        this.customerStatus = customerStatusData?.data;
        this.customerStatus = this.customerStatus.filter((a:any)=> a.status_title != "Busy");
        console.log(this.customerStatus);
        this.filteredStatus = this.customerStatus;
      })
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

     var property = JSON.parse(resp[0].data)?.data || [];
      var budget = JSON.parse(resp[1].data)?.data || [];
     var unitTypes = JSON.parse(resp[2].data)?.data || [];
     var propertyStatus = JSON.parse(resp[3].data)?.data || [];
      property.forEach(element => {
        this.propertyLocationOptions.push({name:element})
      });
      budget.forEach(element => {
        this.budgetOptions.push({name:element})
      });
      unitTypes.forEach(element => {
        this.unitTypeOptions.push({name:element})
      });
      propertyStatus.forEach(element => {
        this.propertyStatusOptions.push({name:element})
      });
      this.propertyOptsList =  this.propertyLocationOptions;
      this.budgetList =  this.budgetOptions;
      this.unitTypeList =  this.unitTypeOptions;
      this.prpertyStatusList =  this.propertyStatusOptions;
      this.optionsDatLaoding = false;
    }).catch((err: any) => {
      console.log(err)
      this.optionsDatLaoding = false;
    });
  }

  UpdateCustomer(){
    console.log(this.addCustomerForm.value)

    if (this.addCustomerForm.valid) {
      this.loading = true;

      let apiData = this.addCustomerForm.value;
      let userData = this.dataService.getUserData()
      apiData["user_id"] = userData['id'];
      apiData["lead_id"] = this.selectedCustomer.id;
      apiData["login_type"] = userData['login_type'];
      apiData["customer_name"] = this.addCustomerForm.value.c_name;
      apiData["c_phone"] = this.addCustomerForm.value.c_country_code + this.addCustomerForm.value.c_phone;
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

    }else{
      this.commonService.presentToast('warning',"Please check details!");
    }

  }
}
