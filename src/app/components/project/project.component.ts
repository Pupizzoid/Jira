import { TaskFormComponent } from './../task-form/task-form.component';
import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ApiService } from 'src/app/services';
import { IProjectData } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { userData, projectData } from '../../utilites';
import { IUserData, ITaskData } from '../../interfaces';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  public id: string;
  public isChecked = false;
  public userData: IUserData = userData;
  public projectData: IProjectData = projectData;
  public usersList: IUserData[] = [];
  public tasksList: ITaskData[] = [];
  public todo: ITaskData[];
  public progress: ITaskData[];
  public review: ITaskData[];
  public done: ITaskData[];
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
  ) {
  }

  private subscriptions = [];

  ngOnInit(): void {
    this.subscriptions.push(
     this.route.params
        .subscribe(params => this.id = params['id'])
    );

    this.subscriptions.push(
      this.api.getProjectById(this.id).subscribe(data => {
        this.projectData = data;
        this.usersList = data.membersInfoList;
      })
    );

    this.subscriptions.push(
      this.api.getAllTasksByProject(this.id).subscribe(data => {
      const newData = data.filter(task => task.projectId === this.id)
      this.todo = newData.filter(item => item.status.toLowerCase() === 'todo');
      this.progress = newData.filter(item => item.status.toLowerCase() === 'progress');
      this.review = newData.filter(item => item.status.toLowerCase() === 'review');
      this.done = newData.filter(item => item.status.toLowerCase() === 'done');
      this.tasksList = newData;
      })
    );

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
  public handleChange = (event) => {
    const method = event.checked ? this.api.getTaskAssignedTo : this.api.getAllTasksByProject;
    const id = event.checked ? this.userData.id : this.id;
    method(id).subscribe(data => {
      this.getAllTasksData(data);
    });
  }

  public openTaskForm = (): void => {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      disableClose: true,
      autoFocus: true,
      width: '60%',
      position: {
        top: '100px'
      } ,
      data: {
        usersList: this.usersList,
        formTitle: "Create Issue",
        title: '',
        description: '',
        assignTo: '',
        status: 'todo',
        type: 'Task',
        priority: 'Medium',
        action: 'create',
        deadline: '',
      }
    })
    this.subscriptions.push(
      dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          const currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
          this.api.addTask({...data, createdDate: currentDate, projectId: this.id});
        }
      }
      )
    );
  }

  public openTask = (item: ITaskData): void => {
    const width = this.api.screenSize > 600 ? '60%' : '100vw';
    const maxWidth = this.api.screenSize > 600 ? '80vw' : '100vw';

    const dialogRef = this.dialog.open(TaskComponent, {
      disableClose: true,
      autoFocus: true,
      width: width,
      maxWidth: maxWidth,
      data: {
        task: item,
        usersList: this.usersList,
      }
    })
  }

  public drop = (event: CdkDragDrop<string[]>): void => {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newTask = Object.assign({}, task, { status: event.container.id });
      this.api.updateTask(newTask)
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  public handleRoute = (id: string): void => {
    this.router.navigate([`dashboard/projects/${this.id}/issue`, id])
  }

  public getAllTasksData = (data) => {
    if (!Array.isArray(data)) {
      data = [data];
    }
    this.todo = data.filter(item => item.status.toLowerCase() === 'todo');
    this.progress = data.filter(item => item.status.toLowerCase() === 'progress');
    this.review = data.filter(item => item.status.toLowerCase() === 'review');
    this.done = data.filter(item => item.status.toLowerCase() === 'done');
  }
}
