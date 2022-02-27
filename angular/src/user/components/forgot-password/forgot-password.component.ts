import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy {
  public subs = new Subscription();
  public numberForm = this.fb.group({
    mobile_number: ['', [Validators.required, Validators.pattern(/[7-9][0-9]{9}/)]]
  });

  constructor(
    public userService: UserService,
    private fb: FormBuilder
  ) {
  }

  sendOtp() {
    this.subs.add(this.userService.sendOtp(this.numberForm.value).subscribe(() => {
      // redirect to reset password
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
