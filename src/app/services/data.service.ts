import { Injectable } from '@angular/core';
import { IUserData, IProjectData } from '../interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private userData: IUserData = {
    name: '',
    email: '',
    id: ''
  };
  private usersList: IUserData[] = [];
  private projectList: IProjectData[] = [];


  public projects: BehaviorSubject<IProjectData[]> = new BehaviorSubject(this.projectList);
  public user: BehaviorSubject<IUserData> = new BehaviorSubject(this.userData);
  public users: BehaviorSubject<IUserData[]> = new BehaviorSubject(this.usersList);

  constructor(private api: ApiService) { }

  public setUserData = (data: IUserData): void => {
    this.userData = data;
    this.user.next(this.userData);
  }

  public setProjectsList = (array: IProjectData[]) => {
    this.projectList = array;
    this.projects.next(this.projectList);
  }

  public setUsersList = (array: IUserData[]) => {
    this.usersList = array;
    this.users.next(this.usersList);
  }
}
