import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingController, Platform } from '@ionic/angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  url = environment.baseUrl;

  constructor(private http: HttpClient, 
    private platform: Platform,
    private loadingController : LoadingController,
     private nativeHttp: HTTP) {
    this.platform.ready().then(() => {
      this.nativeHttp.setDataSerializer('json');
    });
  }

  getUserToken() {
    const user = localStorage.getItem('aryanUser');
    if (user) {
      return JSON.parse(user).token;
    } else {
      return null;
    }
  }

  getUserData() {
    const user = localStorage.getItem('aryanUser');
    // if (user) {
    return JSON.parse(user!);
    // }
    // else {
    //   return null;
    // }
  }

  userLogin(data: any) {
    return this.nativeHttp.post(this.url + 'user-login', data, {
      Appkey: 'test_key',
    });
  }

  userChangePassword(data: any) {
    return this.nativeHttp.post(this.url + 'change-password', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  updateUser(data: any) {
    return this.nativeHttp.post(this.url + 'update-profile', data, {
      Appkey: 'test_key',
    });
  }

  deleteUser(data: any) {
    return this.nativeHttp.post(this.url + 'delete-account', data, {
      Appkey: 'test_key',
    });
  }

  logout(data: any) {
    return this.nativeHttp.post(this.url + 'user-logout', data, {
      Appkey: 'test_key',
    });
  }

  getProjectList(data: any) {
    return this.nativeHttp.get(this.url + 'get-project-list', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }
  getEventalendar(data: any) {
    return this.nativeHttp.get(this.url + `get-event-calendar?event_date=${data.date}&user_id=${data.user_id}`, data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getProjectDetails(data: any) {
    return this.nativeHttp.post(this.url + 'get-project-detail', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }
  getcustomerhomedata(data: any) {
    return this.nativeHttp.post(this.url + 'get-customer-home-data', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }
  getCustomerDashboard(data: any) {
    return this.nativeHttp.post(this.url + 'app/customerHome', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getCustomerStatus(data: any) {
    return this.nativeHttp.get(this.url + 'get-status-for-call-log', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getAllNotes(data: any) {
    return this.nativeHttp.get(this.url + `get-notes?lead_id=${data.lead_id}&user_id=${data.user_id}`, data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  addCustomer(data: any) {
    return this.nativeHttp.post(this.url + 'add-customer', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }
  addNewNotes(data: any) {
    return this.nativeHttp.post(this.url + 'add-notes', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }
  updateLead(data: any) {
    return this.nativeHttp.post(this.url + 'update-lead', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }
  getNewLeadData(data: any) {
    return this.nativeHttp.post(this.url + 'get-lead-data', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }
  searchCustomer(data: any) {
    return this.nativeHttp.get(this.url + 'get-search-customer-list', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getCustomerList(data: any) {
    return this.nativeHttp.get(this.url + 'get-customer-list', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getUserDashboard(data: any) {
    return this.nativeHttp.post(this.url + 'dashboard', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getBannerImage() {
    return this.nativeHttp.get(this.url + 'get-home-data', {}, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  userCheckInOut(data: any) {
    return this.nativeHttp.post(this.url + 'checkin-checkout', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  saveScheduleEvent(data: any) {
    return this.nativeHttp.post(this.url + 'app/event_scheduler', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  applyUserLeave(data: any) {
    return this.nativeHttp.post(this.url + 'app/applyLeavedata', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getHolidayList() {
    return this.nativeHttp.get(this.url + 'app/getallholidaylist', {}, {});
  }

  getCallbackReminderList(data: any) {
    return this.nativeHttp.post(this.url + 'callback-reminder-list', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getLeadsList(data: any) {
    return this.nativeHttp.get(this.url + 'get-lead-list', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getUserNotice(data: any) {
    return this.nativeHttp.post(this.url + 'get-notice-mail', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getUserGroupNotice(data: any) {
    return this.nativeHttp.post(this.url + 'get-notice-mails-group', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  validateJWTToken(data: any) {
    return this.nativeHttp.post(this.url + 'validate-jwt-token', data, {
        Bearer: this.getUserToken(),
        Appkey: 'test_key'
    });
  }

  getPropertyLocationOptionList() {
    return this.nativeHttp.get(this.url + 'get-property-location', {}, {});
  }
  GetLeadbyID(id) {
    return this.nativeHttp.get(this.url + `get-lead-by-id?lead_id=${id}`, {}, {});
  }
  GetCallByID(id) {
    return this.nativeHttp.get(this.url + `get-call-data-by-id?req_id=${id}`, {}, {});
  }
  getBudgetOptionList() {
    return this.nativeHttp.get(this.url + 'get-budget-option', {}, {});
  }
  
  getUnitTypeOptionList() {
    return this.nativeHttp.get(this.url + 'get-unit-type', {}, {});
  }

  getPropertyStatusOptionList() {
    return this.nativeHttp.get(this.url + 'get-property-status', {}, {});
  }
  
  getProctDevelopersList() {
    return this.nativeHttp.get(this.url + 'get-project-developer', {}, {});
  }

  getProctTypeList() {
    return this.nativeHttp.get(this.url + 'get-project-type', {}, {});
  }

  getProctStatusList() {
    return this.nativeHttp.get(this.url + 'get-project-status', {}, {});
  }

  getProjectFurnishingList() {
    return this.nativeHttp.get(this.url + 'get-project-furnishing', {}, {});
  }
  Getprojectcategory(){
    return this.nativeHttp.get(this.url + 'get-project-category', {}, {});
  }
  Getprojecttype(id){
    return this.nativeHttp.get(this.url + `get-project-type?category_id=${id}`, {}, {});
  }
  getStaticContent(type: string) {
    return this.nativeHttp.get(this.url + type, {}, {});
  }
  async presentLoadingWithDuration(message = "") {
    return await this.loadingController
      .create({
        duration: 8000,
        message:message ? message : "Please wait...",
      })
      .then((a) => {
        a.present().then(() => {
        });
      });
  }
  async simpleLoader() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
  }
  async loaderDismiss() {
    return await this.loadingController.dismiss();
  }

}
