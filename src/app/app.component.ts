import { Component} from '@angular/core';
import { ApiService } from './services';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { slideInAnimation} from './app-animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation ]
})
export class AppComponent{
  title = 'Jira';
  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AngularFireAuth
  ) { }
}
