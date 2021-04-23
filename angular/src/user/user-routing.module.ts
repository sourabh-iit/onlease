import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddNumberComponent } from './components/add-number/add-number.component';
import { AddressComponent } from './components/address/address.component';
import { AgreementComponent } from './components/agreement/agreement.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LoginComponent } from './components/login/login.component';
import { MyAddressesComponent } from './components/my-addresses/addresses.component';
import { MyAgreementsComponent } from './components/my-agreements/agreements.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { MyFavoritesComponent } from './components/my-favorites/my-favorites.component';
import { MyLodgingsComponent } from './components/my-lodgings/my-lodgings.component';
import { EditProfileComponent } from './components/profile/edit-profile.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'register',
    component: RegisterComponent
  }, {
    path: 'agreements/:agreementId',
    component: AgreementComponent
  }, {
    path: 'address/:addressId',
    component: AddressComponent
  }, {
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
    }, {
      path: 'agreements',
      component: MyAgreementsComponent
    }, {
      path: 'addresses',
      component: MyAddressesComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
