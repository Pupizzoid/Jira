import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services';
import { MatDialog } from '@angular/material/dialog';
import { IProjectData } from '../../interfaces';
import { FormProjectComponent } from '../form-project/form-project.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input() project: IProjectData;
  @Input() userDataId: string;
  public isOwner: boolean = false;
  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.userDataId = this.api.userData.id;
  }

  ngOnInit(): void {
    this.isOwner = this.project.ownerId === this.userDataId;
  }

  public handleEdit = (project: IProjectData): void => {
    const width = this.api.screenSize > 600 ? '60%' : '100vw';
    const maxWidth = this.api.screenSize > 600 ? '80vw' : '100vw';
    const { title, description, id, membersInfoList} = project;
    const dialogRef = this.dialog.open(FormProjectComponent, {
      disableClose: true,
      autoFocus: true,
      width,
      maxWidth,
      data: {
        title,
        description,
        membersInfoList
      }
    })
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          console.log(data);

          const { title, description } = data;
          const project = { title, description, ownerId: this.userDataId , tasks:[]}
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
