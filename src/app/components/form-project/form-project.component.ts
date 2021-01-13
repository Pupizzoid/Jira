import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService, DataService } from 'src/app/services';
import {IUserData} from '../../interfaces';
// import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss']
})
export class FormProjectComponent implements OnInit {
  public form: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredUsers: Observable<IUserData[]>;
  selectedUsers: IUserData[] = [];
  public usersList: IUserData[] = [];


  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    private dialogRef: MatDialogRef<FormProjectComponent>,
    private fb: FormBuilder,
    private api: ApiService
  ) { }

  private subscriptions = [];

  ngOnInit(): void {
    this.form = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      participants: new FormControl(this.selectedUsers)
    });

    this.subscriptions.push(this.api.users.subscribe((users) => {
      this.usersList = users;
    }));

    this.filteredUsers = <Observable<IUserData[]>>this._getParticipants.valueChanges.pipe(
      startWith(null),
      map((user: IUserData | null) => user?.name ? this._filter(user.name) : this.usersList.slice()));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }


  public handleCreate() {
    const { title, description } = this.form.value;
    const newProject = {title, description, participants: this.selectedUsers }
    this.dialogRef.close(newProject);
  }

  public handleClose() {
    this.dialogRef.close();
  }

  get _title() {
    return this.form.get('title');
  }

  get _description() {
    return this.form.get('description');
  }

  get _getParticipants() {
    return this.form.get('participants');
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const fruit = this.usersList.find(item => item.name === value?.trim())
    // Add our fruit
    if (fruit) {
      this.selectedUsers.push(fruit);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this._getParticipants.setValue(null);
  }

  remove(fruit: IUserData): void {
    this.selectedUsers = this.selectedUsers.filter(item => item.id !== fruit.id);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const fruit = this.usersList.find(item => item.name === event.option.viewValue)
    this.selectedUsers.push(fruit);
    this.fruitInput.nativeElement.value = '';
    this._getParticipants.setValue(null);
  }

  private _filter(value: string): IUserData[] {
    const filterValue = value.toLowerCase();

    return this.usersList.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
