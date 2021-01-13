import { Component, OnInit } from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import { ApiService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public authForm: FormGroup;
  public isRegister: boolean = false;
  public urlPath: string;
	public path: string = '/login';

  constructor(
    private router: Router,
    private api: ApiService,
  ) {
    this._createForm();
    this.api.signedIn.subscribe(user => {
      this.isRegister = user;
    });
   }

  ngOnInit(): void {
    this.urlPath = this.router.url;
    if (this.urlPath === this.path) {
      this.isRegister = true;
      this.path = '/register';
    }
  }

  public handleSubmit(): void {
    const { email, password, name} = this.authForm.value;
    const submitMethod = this.isRegister ? this.api.login : this.api.register;
    submitMethod(email, password)
      .then((user) => {
        if (user.additionalUserInfo.isNewUser) {
          const userData = {
            name,
            email,
            password,
            id: user.user.uid,
            photoURL: ''
          }
          this.api.updateUserData(userData)
        }
        this.router.navigate(['dashboard']);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public loginWithGoogle = () => {
    this.api.googleSignIn()
    .then((result) => {
      var credential = result.credential;
      var user = result.user;
      if (user) {
        const userData = {
          name: user.displayName,
          id: user.uid,
          email: user.email,
          password: '',
          photoURL: user.photoURL
        }
        this.api.updateUserData(userData);
        if (this.isRegister) {
          this.router.navigate(['dashboard']);
        }
      }
  })
  }

  public loginWithGitHub = () => {
    this.api.gitHubSignIn()
      .then((result) => {

      // var credential = result.credential;
      // var user = result.user;
      // if (user) {
      //   const userData = {
      //     name: user.displayName,
      //     id: user.uid,
      //     email: user.email,
      //     password: '',
      //     photoURL: user.photoURL
      //   }
      //   this.api.updateUserData(userData);
      //   if (this.isRegister) {
      //     this.router.navigate(['dashboard']);
      //   }
      // }
  })
  }

  private _createForm (): void {
    this.authForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  //Todo create type for getter

  get _name() {
    return this.authForm.get('name');
  }

  get _email() {
    return this.authForm.get('email');
  }

  get _password() {
    return this.authForm.get('password');
  }
}
