import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { UserRoutingModule } from './user-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditProfileComponent } from './components/profile/edit-profile.component';
import { AddNumberComponent } from './components/add-number/add-number.component';
import { MyLodgingsComponent } from './components/my-lodgings/my-lodgings.component';
import { MyFavoritesComponent } from './components/my-favorites/my-favorites.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { AgreementComponent } from './components/agreement/agreement.component';
import { MyAgreementsComponent } from './components/my-agreements/agreements.component';
import { MyAddressesComponent } from './components/my-addresses/addresses.component';
import { AddressComponent } from './components/address/address.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyOtpComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    AddNumberComponent,
    MyLodgingsComponent,
    MyFavoritesComponent,
    MyBookingsComponent,
    AgreementComponent,
    MyAgreementsComponent,
    MyAddressesComponent,
    AddressComponent
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    UserRoutingModule,
  ],
  providers: [
  ]
})
export class UserModule { }
