import { taskData } from './../utilites';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IUserData, IProjectData, ITaskData } from '../interfaces';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
// const getObservable = (collection: AngularFirestoreCollection<ITaskData>) => {
//   const subject = new BehaviorSubject([]);
//   collection.valueChanges({ idField: 'id' }).subscribe((val: ITaskData[]) => {
//     subject.next(val)
//   });
//   return subject;
// }
@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public signedIn: Observable<any>;
  private usersCollection: AngularFirestoreCollection<IUserData>;
  private projectsCollection: AngularFirestoreCollection<IProjectData>;
  private tasksCollection: AngularFirestoreCollection<ITaskData>;
  // public todoTasksList = getObservable(this.fs.collection('todo'));
  // public runningTasksList = getObservable(this.fs.collection('running'));
  // public reviewTasksList = getObservable(this.fs.collection('review'));
  // public doneTasksList = getObservable(this.fs.collection('done'));
  users: Observable<IUserData[]>;
  projects: Observable<IProjectData[]>;
  taskData: Observable<ITaskData[]>;
  tasks: BehaviorSubject<ITaskData[]> = new BehaviorSubject([]);
  currentTask: Observable<IUserData>;
  user: Observable<any>;
  // projectsList: BehaviorSubject<ITaskData[]> = new BehaviorSubject([]);



  constructor(
    private afAuth: AngularFireAuth,
    private fs: AngularFirestore
  ) {
    this.usersCollection = this.fs.collection<IUserData>('users');
    this.projectsCollection = this.fs.collection<IProjectData>('projects');
    this.tasksCollection = this.fs.collection<ITaskData>('tasks');
    this.user = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.fs.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null)
        }
      })
    )

    this.signedIn = new Observable((subscriber) => {
      this.afAuth.onAuthStateChanged(subscriber);

      this.users = this.usersCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IUserData;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.projects = this.projectsCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IProjectData;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.getAllTasks();
    });
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
      .then((res) => {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    })
  }

  public logout = () => {
    return this.afAuth.signOut();
  }

  public getCurrentUserData = (id) => {
    return this.usersCollection.ref.where('id', "==", id).get()
  }

  public updateUserData = ({id, name, email, photoURL}: IUserData) => {
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
    return this.projectsCollection.ref.where('__name__', "==", id).get()
  }

  public getUsersProject = (id) => {
   return this.projectsCollection.ref.where('ownerId', "==", id).get()
  }

  public getAllTasks = () => {
    // this.tasksCollection.ref.where('projectId', "==", id)
    //   .onSnapshot((querySnapshot)  => {
    //     const tasks = [];
    //     querySnapshot.forEach((doc) => {
    //       tasks.push(doc.data());
    //       // cities.push(doc.data());
    //     });
    //     this.tasks.next(tasks)
    //   })
    this.tasksCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ITaskData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(list => {
      this.tasks.next(list)
    })
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
    return this.tasksCollection.ref.where('__name__', "==", id)
  }

  public getTaskAssignedTo = (id) => {
    return this.tasksCollection.ref.where('assignTo.id', "==", id).get()
  }
}
