import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import {IUserData} from '../../interfaces';
@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss']
})
export class FormProjectComponent implements OnInit {
  public form: FormGroup;
  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredUsers: Observable<IUserData[]>;
  public selectedUsers: IUserData[] = [];
  public usersList = [];
  private subscriptions = [];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormProjectComponent>,
    private fb: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.selectedUsers = this.data.membersInfoList;

    this.form = this.fb.group({
      title: [this.data.title, [Validators.required]],
      description: [this.data.description, [Validators.required]],
      members: [''],
      membersInput: [this.selectedUsers]
    });

    this.subscriptions.push(
      this.api.users.subscribe((users) => {
      this.usersList = users;
      })
    );

    this.filteredUsers = <Observable<IUserData[]>>this.members.valueChanges
      .pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.usersList.slice())
      );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  public handleCreate = (): void => {
    const { title, description } = this.form.value;
    const newProject = {title, description, members: this.selectedUsers}
    this.dialogRef.close(newProject);
  }

  public handleClose = (): void => {
    this.dialogRef.close();
  }

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }

  get members() {
    return this.form.get('members') as FormArray;
  }

  public add = (event: MatChipInputEvent): void =>{
    const input = event.input;
    const value = event.value;
    const fruit = this.usersList.find(item => item.name === value?.trim())
    if (fruit) {
      this.selectedUsers.push(fruit);
    }
    if (input) {
      input.value = '';
    }
    this.members.setValue(null);
  }

  public remove = (fruit: IUserData): void => {
    this.selectedUsers = this.selectedUsers.filter(item => item.id !== fruit.id);
  }

  public selected = (event: MatAutocompleteSelectedEvent): void => {
    const fruit = this.usersList.find(item => item.name === event.option.viewValue)
    this.selectedUsers.push(fruit);
    this.fruitInput.nativeElement.value = '';
    this.members.setValue(null);
  }

  private _filter = (value: string): string[] =>{
    const filterValue = value['name'] ? value['name'].toLowerCase() : value.toLowerCase();
    // return this.usersList.filter(fruit => fruit.name.toLowerCase().includes(filterValue));
    return this.usersList.filter((fruit: IUserData) => new RegExp(value, 'gi').test(fruit['name']));
  }
}
