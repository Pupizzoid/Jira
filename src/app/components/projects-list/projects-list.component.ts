import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormProjectComponent } from '../form-project/form-project.component';
import { ApiService, AlertService } from 'src/app/services';
import { MatDialog } from '@angular/material/dialog';
import { userData } from '../../utilites';
import { IUserData, IProjectData } from '../../interfaces';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent implements OnInit {
  public projectList: IProjectData[] = [];
  public userData: IUserData = userData;
  public userAuth: Subscription;
  constructor(
    private router: Router,
    private api: ApiService,
    public dialog: MatDialog,
    private alert: AlertService
  ) { }

  private subscriptions = []

  ngOnInit(): void {
    this.subscriptions.push(this.api.projects.subscribe((projects) => {
      this.projectList = projects;
    }));
    this.subscriptions.push(this.userAuth = this.api.signedIn.subscribe((user) => {
      if (user) {
        this.api.getCurrentUserData(user.uid)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.userData = doc.data();
            });
          })
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  public openDialog = (): void => {
    const dialogRef = this.dialog.open(FormProjectComponent, {
      disableClose: true,
      autoFocus: true,
      width: '60%',
      data: {
        title: '',
        description: '',
        participants: ''
      }
    })
    this.subscriptions.push(dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          const { title, description, participants } = data;
          const project = { title, description, ownerId: this.userData.id , tasks:[]}
          this.api.addProject(project)
        }
      }
  ));
  }
}
