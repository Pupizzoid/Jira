import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { IUserData, IProjectData, ITaskData } from '../interfaces';
import { Observable, BehaviorSubject, of } from 'rxjs';
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
  public screenSize = window.innerWidth;
  private usersCollection: AngularFirestoreCollection<IUserData>;
  private projectsCollection: AngularFirestoreCollection<IProjectData>;
  private tasksCollection: AngularFirestoreCollection<ITaskData>;

  public users: Observable<IUserData[]>;
  public userData: IUserData;

  constructor(
    private afAuth: AngularFireAuth,
    private fs: AngularFirestore
  ) {
    this.usersCollection = this.fs.collection<IUserData>('users');
    this.projectsCollection = this.fs.collection<IProjectData>('projects1');
    this.tasksCollection = this.fs.collection<ITaskData>('tasks1');
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        const userData = {
          id: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
          email: user.email
        }
        this.userData = userData;
      }
    });
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
    const ownProjects = this.fs.collection('projects1', ref => ref.where('ownerId', "==", id))
      .snapshotChanges()
      .pipe(map(processChanges));
    const membersProjects = this.fs.collection('projects1', ref => ref.where('members', 'array-contains', id))
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
    return this.fs.collection('tasks1', ref => ref.where('projectId', "==", id))
      .snapshotChanges()
      .pipe(map(processChanges))
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

  public getTaskAssignedTo = (id) => {
    return this.fs.collection('tasks1', ref => ref.where('assignTo.id', "==", id))
      .snapshotChanges()
      .pipe(map(processChanges))
    // return this.tasksCollection.ref.where('assignTo.id', "==", id).get()
  }
}
