import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-events-with-calendar',
  templateUrl: './events-with-calendar.page.html',
  styleUrls: ['./events-with-calendar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EventsWithCalendarPage implements OnInit {
  selectedDate:any;
  userData: any;
  AllEventsList: any=[];
  constructor(
    private commonService: CommonService,
    public dataService: DataService,
    private _nav:NavController,
    private activeRoute:ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.userData = this.dataService.getUserData();
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${year}-${month}-${day}`;
      console.log(currentDate); // "17-6-2022"
      this.selectedDate = currentDate;
      this.getEvents(this.selectedDate)
  }
  OnDateChange(event){
    console.log(this.selectedDate);
    this.getEvents(this.selectedDate);
  }
  gotoBack(){
    this.router.navigateByUrl("/customer-landing")
  }
  getEvents(date): void {
    let data: any = {
      user_id: this.userData?.id,
      date: date,
    }
    console.log(data)
    this.dataService.getEventalendar(data)
      .then((resp: any) => {
        console.log("event list", resp)
        const response = JSON.parse(resp.data);
        this.AllEventsList = response.data;
        console.log(this.AllEventsList)
        
      }).catch((err) => {
        console.log(err)
      });
  }
}
