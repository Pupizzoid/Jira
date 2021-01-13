import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectComponent } from './components/project/project.component';
import { TaskComponent } from './components/task/task.component';
import { canActivate } from '@angular/fire/auth-guard';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectLoggedInUser = () => redirectLoggedInTo(['dashboard']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {path: 'login', component: AuthComponent, ...canActivate(redirectLoggedInUser), },
  {path: 'register', component: AuthComponent, ...canActivate(redirectLoggedInUser)},
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
    { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', component: ProjectsListComponent },
      {
        path: 'projects/:id',
        component: ProjectComponent,
      }
    ],
    ...canActivate(redirectUnauthorizedToLogin),
    data: {state: 'dashboard'}
  },
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
