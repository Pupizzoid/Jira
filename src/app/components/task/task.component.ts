import { taskData } from './../../utilites';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from "@angular/material/dialog";
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ITaskData } from '../../interfaces';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit{
  public taskData: ITaskData = taskData;
  public deadline;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TaskComponent>,
    public dialog: MatDialog,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.api.getTaskById(this.data.task.id).subscribe(data => {
      this.taskData = data;
      this.taskData.deadline = new Date(data.deadline).toJSON().slice(0, 10).replace(/-/g, '-');
    })
  }
  public openDialog = (): void => {
    const width = this.api.screenSize > 600 ? '60%' : '100vw';
    const maxWidth = this.api.screenSize > 600 ? '80vw' : '100vw';

    const dialogRef = this.dialog.open(TaskFormComponent, {
      disableClose: true,
      autoFocus: true,
      width,
      maxWidth,
      data: {
        usersList: this.data.usersList,
        formTitle: "Edit Issue",
        title: this.taskData.title,
        description: this.taskData.description,
        assignTo: this.taskData.assignTo.name,
        type: this.taskData.type,
        status: this.taskData.status,
        priority: this.taskData.priority,
        action: 'edit',
        id: this.data.task.id,
        deadline: this.taskData.deadline
      }
    })
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.api.updateTask(data)
        }
      }
    );
  }

  public deleteItem = (): void => {
    this.api.deleteTask(this.data.task.id);
    this.dialogRef.close();
  }
}
