import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services';
import { IUserData, IProjectData } from '../../interfaces';
import { userData, projectData } from '../../utilites';
import { slideInAnimation } from '../../app-animation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [slideInAnimation]
})
export class DashboardComponent implements OnInit, OnDestroy {
  public projectList: IProjectData[] = [projectData];
  public userData: IUserData = userData;
  constructor(
    private api: ApiService,
  ) {}

  private subscriptions = [];
  ngOnInit(): void {
    this.subscriptions.push(
      this.api.signedIn.subscribe(user => {
      if (user) {
        const userInfo = {
          id: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
          email: user.email
        }
        this.userData = userInfo
      }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }
}
