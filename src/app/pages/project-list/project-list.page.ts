import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { Router, RouterLinkActive } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

declare var $: any;

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkActive]
})
export class ProjectListPage implements OnInit {

  userData: any;
  initProjectList: any[] = [];
  projectList: any[] = [];
  projectListLoading: boolean = false;
  optionsDatLaoding: boolean = false;

  filterOptions: any[] = [];
  projectDeveloperOptions: any[] = [];
  unitTypeOptions: string[] = [];

  filters: any = {
    unit: "",
    developer: "",
    sort_by: "",
    filter_by: "",
    search:""
  }

  constructor(
    private dataService: DataService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.userData = this.dataService.getUserData();
    this.getProjectList();

    this.getFilterOptions();
  }

  getFilterOptions(): void {
    this.optionsDatLaoding = true;

    const projectDeveloperDataPromise = this.dataService.getProctDevelopersList()
    const unitTypeDataPromise = this.dataService.getUnitTypeOptionList()
    
    const projectTypeDataPromise = this.dataService.getProctTypeList()
    const projectStatusDataPromise = this.dataService.getProctStatusList()
    const projectFurnishingDataPromise = this.dataService.getProjectFurnishingList()
    const propertyLocationDataPromise = this.dataService.getPropertyLocationOptionList();

    Promise.all([projectDeveloperDataPromise, unitTypeDataPromise, projectTypeDataPromise, projectStatusDataPromise, projectFurnishingDataPromise, propertyLocationDataPromise])
    .then((resp: any) => {
      console.log(resp)
      
      this.projectDeveloperOptions = JSON.parse(resp[0].data)?.data || [];
      this.unitTypeOptions = JSON.parse(resp[1].data)?.data || [];
      
      let projectTypeOptions = JSON.parse(resp[2].data)?.data || [];
      projectTypeOptions.forEach((projectTypeOption: any) => {
        this.filterOptions.push({
          type: 'type',
          name: projectTypeOption.project_type
        })
      });
      
      let projectStatusOptions = JSON.parse(resp[3].data)?.data || [];
      projectStatusOptions.forEach((projectStatusOption: any) => {
        this.filterOptions.push({
          type: 'status',
          name: projectStatusOption.name
        })
      });

      let projectFurnishingOptions = JSON.parse(resp[4].data)?.data || [];
      projectFurnishingOptions.forEach((projectFurnishingOption: any) => {
        this.filterOptions.push({
          type: 'furnish',
          name: projectFurnishingOption.name
        })
      });

      let propertyLocationOptions = JSON.parse(resp[5].data)?.data || [];
      propertyLocationOptions.forEach((propertyLocationOption: any) => {
        this.filterOptions.push({
          type: 'location',
          name: propertyLocationOption
        })
      });

      setTimeout(() => {
        $("select").formSelect();
      }, 1000);

    }).catch((err: any) => {
      console.log(err)
      this.optionsDatLaoding = false;
    });
  }

  getProjectList(): void {
    this.projectListLoading = true;
    let data: any = {
      user_id: this.userData.user_id,
      login_type: String(this.userData.login_type),
      developer: this.filters.developer,
      unit: this.filters.unit,
      price: this.filters.sort_by,
      search : this.filters.search
    }
    if(this.filters.filter_by) {
      let matchIndex = this.filterOptions.findIndex((options: any) => options.name == this.filters.filter_by);
      if(matchIndex !== -1) {
        let selectedFilterOption:any = this.filterOptions[matchIndex]
        data[selectedFilterOption.type] = selectedFilterOption.name;
      }
    }
    console.log(data)
    this.dataService.getProjectList(data)
      .then((resp: any) => {
        this.projectListLoading = false;
        console.log("project list", resp)
        const response = JSON.parse(resp.data);

        this.initProjectList = JSON.parse(JSON.stringify(response.data));
        if(this.initProjectList?.length > 10) {
          this.projectList = this.initProjectList.splice(0, 10)
        } else {
          this.projectList = this.initProjectList;
        }
      }).catch((err) => {
        console.log(err)
        this.projectListLoading = false;
      });
  }
  handleChange(event) {
    var str = event.detail.value;
    console.log(str)
    this.filters.search = str;
    this.getProjectList();
  }
  onIonInfinite(ev:any) {
    setTimeout(() => {
      this.projectList = this.projectList.concat(this.initProjectList.splice(this.projectList.length, 10));
      console.log(this.projectList);
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  goToProjectDetails(id: string | number) {
    this.router.navigateByUrl("/project-detail/"+id)
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      if ($(".collapsible").length) {
        $(".collapsible").collapsible();
      }
      if ($(".collapsible.expandable").length) {
        $(".collapsible.expandable").collapsible({
          accordion: false
        });
      }
  
      $(".dropdown-trigger").dropdown();
    });
  }

}
