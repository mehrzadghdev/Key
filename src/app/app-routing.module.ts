import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from './shared/guards/authorize.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/software/company' },
  { path: 'auth', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'software', loadChildren: () => import('./software/software.module').then(m => m.SoftwareModule), canLoad: [AuthorizeGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
