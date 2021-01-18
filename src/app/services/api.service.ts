import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { IUserData, IProjectData, ITaskData } from '../interfaces';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import firebase from 'firebase/app';

const processChanges = (changes) => {
  return changes.map(a => {
    const data = a.payload.doc.data() ;
    const id = a.payload.doc.id;
    return {id, ...data};
  })
}
@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public signedIn: Observable<any>;
  public screenSize = window.innerWidth;
  private usersCollection: AngularFirestoreCollection<IUserData>;
  private projectsCollection: AngularFirestoreCollection<IProjectData>;
  private tasksCollection: AngularFirestoreCollection<ITaskData>;

  public users: Observable<IUserData[]>;
  public userData: Subject<IUserData> = new Subject();

  constructor(
    private afAuth: AngularFireAuth,
    private fs: AngularFirestore
  ) {
    this.usersCollection = this.fs.collection<IUserData>('users');
    this.projectsCollection = this.fs.collection<IProjectData>('projects');
    this.tasksCollection = this.fs.collection<ITaskData>('tasks');

    this.signedIn = new Observable((subscriber) => {
      this.afAuth.onAuthStateChanged(subscriber);
    })

    this.users = this.usersCollection.snapshotChanges().pipe(map(processChanges));
  }

  public googleSignIn = () => {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  public gitHubSignIn = () => {
    return this.afAuth.signInWithPopup(new firebase.auth.GithubAuthProvider())
  }

  public register = (email, password) => {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }
  public login = (email, password) => {
    return this.afAuth.setPersistence('session')
      .then(() => {
        return this.afAuth.signInWithEmailAndPassword(email, password);
      })
  }

  public logout = () => {
    return this.afAuth.signOut();
  }

  public updateUserData = ({ id, name, email, photoURL }: IUserData) => {
    const userRef = this.usersCollection.doc(`${id}`);
    const data = {
      id,
      email,
      name,
      photoURL
    }
    return userRef.set(data, { merge: true });
  }

  public addUser = (user: IUserData) => {
    this.usersCollection.add(user);
  }

  public addProject = (project: IProjectData) => {
    return this.projectsCollection.add(project);
  }

  public getProjectById = (id) => {
    return this.projectsCollection.doc(id).valueChanges()
  }

  public getProjects = (id): Observable<IProjectData[]> => {
    const ownProjects = this.fs.collection('projects', ref => ref.where('ownerId', "==", id))
      .snapshotChanges()
      .pipe(map(processChanges));
    const membersProjects = this.fs.collection('projects', ref => ref.where('members', 'array-contains', id))
      .snapshotChanges()
      .pipe(map(processChanges));
     return combineLatest<any[]>(ownProjects, membersProjects).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur)))
    )
  }

  public updateProject = (project, id) => {
    this.projectsCollection.doc(id).update(project);
  }

  public deleteProject = (id) => {
    this.projectsCollection.doc(id).delete();
  }

  public getAllTasksByProject = (id) => {
    return this.fs.collection('tasks', ref => ref.where('projectId', "==", id))
      .snapshotChanges()
      .pipe(
        map(processChanges)
      )
  }

  public addTask = (task) => {
    this.tasksCollection.add(task);
  }

  public updateTask = (task) => {
    this.tasksCollection.doc(task.id).update(task);
  }

  public deleteTask = (id) => {
    this.tasksCollection.doc(id).delete();
  }

  public getTaskById = (id) => {
    return this.tasksCollection.doc(id).valueChanges()
  }

  public getTaskAssignedTo = (id, projectId) => {
    return this.fs.collection('tasks', ref => ref.where('assignTo.id', "==", id).where('projectId', "==", projectId))
      .snapshotChanges()
      .pipe(map(processChanges))
  }
}
