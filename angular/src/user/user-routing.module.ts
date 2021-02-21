import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNumberComponent } from './components/add-number/add-number.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LoginComponent } from './components/login/login.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { MyFavoritesComponent } from './components/my-favorites/my-favorites.component';
import { MyLodgingsComponent } from './components/my-lodgings/my-lodgings.component';
import { EditProfileComponent } from './components/profile/edit-profile.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'me',
    children: [{
      path: 'change-password',
      component: ChangePasswordComponent
    }, {
      path: 'profile',
      component: EditProfileComponent
    }, {
      path: 'add-number',
      component: AddNumberComponent
    }, {
      path: 'ads',
      component: MyLodgingsComponent
    }, {
      path: 'favorites',
      component: MyFavoritesComponent
    }, {
      path: 'bookings',
      component: MyBookingsComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
