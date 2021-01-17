import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services';
import { Router } from '@angular/router';
import { IUserData, IProjectData } from '../../interfaces';
import { userData, projectData } from '../../utilites';
import { slideInAnimation } from '../../app-animation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [slideInAnimation ]
})
export class DashboardComponent implements OnInit {
  public projectList: IProjectData[] = [projectData];
  public userData: IUserData = userData;
  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  private subscriptions = [];
  ngOnInit(): void {
    if (this.api.userData) {
      this.userData = this.api.userData;
    } else {
      this.router.navigate([ 'login' ]);
    }
  }
}
