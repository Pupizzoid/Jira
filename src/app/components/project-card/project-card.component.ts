import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services';
import { MatDialog } from '@angular/material/dialog';
import { IProjectData, IUserData } from '../../interfaces';
import { FormProjectComponent } from '../form-project/form-project.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input() project: IProjectData;
  @Input() userData: IUserData;
  public isOwner: boolean = false;
  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isOwner = this.project.ownerId === this.userData.id;
  }

  public handleEdit = (project: IProjectData): void => {
    const width = this.api.screenSize > 600 ? '60%' : '100vw';
    const maxWidth = this.api.screenSize > 600 ? '80vw' : '100vw';
    const { title, description, id, membersInfoList, ownerId } = project;
    const newMembersList = membersInfoList.filter(item => item.id !== ownerId);
    const dialogRef = this.dialog.open(FormProjectComponent, {
      disableClose: true,
      autoFocus: true,
      width,
      maxWidth,
      data: {
        title,
        description,
        membersInfoList: newMembersList
      }
    })
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          const { title, description, members } = data;
          const membersArray = members.map(item => item.id);
          const membersInfoList: IUserData[] = [...members, this.userData];
          const project = { title, description, ownerId: this.userData.id, members: membersArray, membersInfoList }
          this.api.updateProject(project, id)
        }
      }
    );

  }

  public handleDelete = (id: string): void => {
    this.api.deleteProject(id);
  }

  public handleClick = (id: string): void => {
    this.router.navigate(['dashboard/projects', id])
  }
}
