import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';

declare var $: any;

@Component({
  selector: 'app-leave',
  templateUrl: './leave.page.html',
  styleUrls: ['./leave.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LeavePage implements OnInit {

  currentTab: string = "leave";
  holidayList: any[] = [];
  holidayListLoading: boolean = false;

  loading: boolean = false;
  applyLeaveForm!: FormGroup;

  constructor(
    private commonService: CommonService,
    public dataService: DataService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.loading = false;
    this.applyLeaveForm = this.fb.group({
      leave_date: ['', [Validators.required]],
      remarks_notes: ['', [Validators.required]]
    });
    $(".datepicker").datepicker();
  }

  tabChanged(tab: string): void {
    this.currentTab = tab;
    if (this.currentTab == "holidays") {
      this.getHolidayData();
    }
  }

  getHolidayData(): void {
    this.holidayListLoading = true;
    this.dataService.getHolidayList()
      .then((resp: any) => {
        const response = JSON.parse(resp.data);
        console.log("holidays", response)
        this.holidayList = response.data
        if (this.holidayList?.length) {
          this.holidayList.forEach((value, index) => {
            if (value?.holiday_date) {
              this.holidayList[index]['holiday_date'] = new Date(value?.holiday_date);
            }
          })
        }
        this.holidayListLoading = false;
      }).catch((err) => {
        this.holidayListLoading = false;
      });
  }

  applyLeave(): void {
    if (this.applyLeaveForm.valid) {
      this.loading = true;

      let apiData = {
        user_id: this.dataService.getUserData().user_id,
        login_type: this.dataService.getUserData().login_type,
        leave_date: this.applyLeaveForm.value.leave_date,
        remarks_notes: this.applyLeaveForm.value.remarks_notes
      }

      this.dataService.applyUserLeave(apiData)
        .then((resp: any) => {
          this.applyLeaveForm.reset();
          const response = JSON.parse(resp.data);
          if (response.status_code == 201) {
            this.commonService.presentToast('warning', response.message);
          } else { this.commonService.presentToast('success', response.message); }
          this.loading = false;
        }).catch((err) => {
          this.loading = false;
        });
    }

  }

  ngAfterViewInit() {
    $(".datepicker").datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != "") {
          let date1 = new Date(date);
          this.applyLeaveForm.controls['leave_date'].setValue(date1.getFullYear() + '-' + String(date1.getMonth() + 1).padStart(2, '0') + '-' + String(date1.getDate()).padStart(2, '0'));
          this.applyLeaveForm.controls['leave_date'].updateValueAndValidity();
        }
      }
    });

  }
}
