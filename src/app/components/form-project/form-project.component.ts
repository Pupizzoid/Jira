import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss']
})
export class FormProjectComponent implements OnInit {
  public form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormProjectComponent>,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.data.title, [Validators.required]],
      description: [this.data.description, [Validators.required]],
    });
  }

  public handleCreate = (): void => {
    const { title, description } = this.form.value;
    const newProject = {title, description}
    this.dialogRef.close(newProject);
  }

  public handleClose = (): void => {
    this.dialogRef.close();
  }

  get _title() {
    return this.form.get('title');
  }

  get _description() {
    return this.form.get('description');
  }
}
