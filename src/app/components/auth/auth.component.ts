import { Component, OnInit } from '@angular/core';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AlertService, ApiService } from '../../services';
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
  private subscriptions = [];
  constructor(
    private router: Router,
    private api: ApiService,
    private alert: AlertService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.urlPath = this.router.url;
    if (this.urlPath === this.path) {
      this.isRegister = true;
      this.path = '/register';
    }

    this.authForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
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
          user.user.updateProfile({
            displayName: name
          }).then(() => {
            this.api.updateUserData(userData);
            this.router.navigate(['dashboard']);
          })
        } else {
          this.router.navigate(['dashboard']);
        }
      })
      .catch((error) => {
        this.alert.error(error.message);
      });
  }

  public handleSocialAuth = (type: string): void => {
    const authMethod = type === 'google' ? this.api.googleSignIn : this.api.gitHubSignIn;
    authMethod()
    .then((result) => {
      const credential = result.credential;
      const user = result.user;
      if (user) {
        const userData = {
          name: user.displayName,
          id: user.uid,
          email: user.email,
          password: '',
          photoURL: user.photoURL
        }
        this.api.updateUserData(userData).then(() => {
          this.router.navigate(['dashboard']);
        })
        // if (this.isRegister) {

        // }
      }
    })
    .catch((error) => {
      this.alert.error(error.message);
    });
  }

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
