import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
export class DashboardComponent implements OnInit, OnDestroy {
  public projectList: IProjectData[] = [projectData];
  public userAuth: Subscription;
  public userData: IUserData = userData;
  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  private subscriptions = [];
  ngOnInit(): void {
    this.subscriptions.push(this.userAuth = this.api.signedIn.subscribe((user) => {
      if (user) {
        this.api.getCurrentUserData(user.uid)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.userData = doc.data();
          });
      })
      } else {
        this.router.navigate([ 'login' ]);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }
}
