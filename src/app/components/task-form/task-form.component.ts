import { Component, OnInit, Inject } from '@angular/core';
import { issuePriority, issueStatus, issueType } from '../../utilites';
import { MatDialogRef } from "@angular/material/dialog";
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { IUserData, ITaskData } from '../../interfaces';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  public issueTypes: string[] = issueType;
  public issuePriorities: string[] = issuePriority;
  public issueStatuses: any[] = issueStatus;
  public form;
  filteredOptions: Observable<IUserData[]>;
  constructor(

   @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
  ) {
    this.form = this.fb.group({
      type: [this.data.type, [Validators.required]],
      priority: [this.data.priority, [Validators.required]],
      status: [this.data.status, [Validators.required]],
      assignTo: [],
      title: [this.data.title, [Validators.required]],
      description: [this.data.description, [Validators.required]],
      deadline: [this.data.deadline, [Validators.required]]
    });
  }


  ngOnInit(): void {
    this.assignTo.setValue({ name: this.data.assignTo });
    this.filteredOptions = <Observable<IUserData[]>>this.assignTo.valueChanges
      .pipe(
        startWith<string | IUserData>(''),
        map((value: string | IUserData) => typeof value === 'string' ? value : value.name),
        map((name: string) => name ? this._filter(name) : this.data.usersList.slice()),
    );
  }

  displayFn(user: IUserData): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): IUserData[] {
    const filterValue = name.toLowerCase();
    return this.data.usersList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  public handleClose() {
    this.dialogRef.close();
  }

  public handleCreate() {
    if (!this.form.valid) {
      return;
    }
    if (this.data.action === 'edit') {
      const editTask = {...this.form.value, id: this.data.id}
      this.dialogRef.close(editTask);
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  get type() {
    return this.form.get('type');
  }

  get priority() {
    return this.form.get('priority');
  }

  get status() {
    return this.form.get('status');
  }

  get assignTo() {
    return this.form.get('assignTo');
  }

  get deadline() {
    return this.form.get('deadline');
  }

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }
}
