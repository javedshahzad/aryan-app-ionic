import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.page.html',
  styleUrls: ['./content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ContentPage implements OnInit {

  pageContent: any = undefined;
  loading: boolean = false;
  type: string = '';

  constructor(
    private activateRouter: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.activateRouter.params.subscribe((params: any) => {
      console.log("params", params)
      this.loadStaticPageContent(params.type)
    })
  }

  loadStaticPageContent(type: string): void {
    this.loading = true;
    this.type = type;

    this.dataService.getStaticContent(type)
      .then((resp: any) => {
        this.loading = false;
        const response = JSON.parse(resp.data);
        console.log("content", response)

        this.pageContent = response.data;

      }).catch((err) => {
        console.log(err)
        this.loading = false;
      });
  }
}
