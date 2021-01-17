import { Component, OnInit} from '@angular/core';
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
    private api: ApiService,
    public dialog: MatDialog,
    private alert: AlertService
  ) {
    this.userData = this.api.userData
  }

  private subscriptions = []

  ngOnInit(): void {
    this.subscriptions.push(
      this.api.getProjects(this.api.userData.id).subscribe(data => {
        this.projectList = [...new Set(data)];
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  public openDialog = (): void => {
    const width = this.api.screenSize > 600 ? '60%' : '100vw';
    const maxWidth = this.api.screenSize > 600 ? '80vw' : '100vw';
    const dialogRef = this.dialog.open(FormProjectComponent, {
      disableClose: true,
      autoFocus: true,
      width,
      maxWidth,
      data: {
        title: '',
        description: '',
        membersInfoList: []
      }
    })
    this.subscriptions.push(dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          const { title, description, members } = data;
          const membersArray = members.map(item => item.id);
          const membersInfoList: IUserData[] = [...members, this.api.userData];
          const project = { title, description, ownerId: this.api.userData.id, members: membersArray, membersInfoList }
          this.api.addProject(project)
        }
      }
  ));
  }
}
