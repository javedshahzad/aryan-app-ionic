import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Share } from '@capacitor/share';

declare var $: any;

register();

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectDetailPage implements OnInit {

  userData: any;
  projectDetails: any = undefined;
  projectDetailsLoading: boolean = false;

  constructor(
    private activateRouter: ActivatedRoute,
    private dataService: DataService
    ) { }

  ngOnInit() {
    this.userData = this.dataService.getUserData();

    this.activateRouter.params.subscribe((params: any) => {
      console.log("params", params)
      this.loadProjectDetails(params.id)
    })
  }

  loadProjectDetails(id: string | number): void {
    this.projectDetailsLoading = true;

    let data = {
      project_id: String(id)
    }

    this.dataService.getProjectDetails(data)
      .then((resp: any) => {
        this.projectDetailsLoading = false;
        const response = JSON.parse(resp.data);
        console.log("project details", response)

        this.projectDetails = response.data;

        setTimeout(() => {
          $("swiper-container").css("height", 400);
        }, 100);
      }).catch((err) => {
        console.log(err)
        this.projectDetailsLoading = false;
      });
  }

  async shareLink(link: string): Promise<void> {
    await Share.share({
      url: link,
    });
  }

}
