import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() displayName: string = "User";
  @Input() photoURL: string = "";
  public imagePath: string;
  constructor(
    private router: Router,
    private api: ApiService
  ) {
   }

  ngOnInit(): void {
  }

  public handleLogout() {
    this.api.logout()
    .then(() => this.router.navigate(['login']))
  }
}
