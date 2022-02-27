import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';

import { UserService } from 'src/app/services/user.service';

export const resetPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm_password = control.get('confirm_password');

  if(confirm_password && password && confirm_password.value != password.value) {
    return { password_mismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnDestroy {
  public subs = new Subscription();
  public resetPasswordForm = this.fb.group({
    otp: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required]]
  }, {validators: resetPasswordValidator});
  public numberForm = this.fb.group({
    mobile_number: ['', [Validators.required, Validators.pattern(/[7-9][0-9]{9}/)]]
  });
  public optSent = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toaster: ToasterService,
    private router: Router
  ) {
  }

  sendOtp() {
    this.subs.add(this.userService.resetPasswordRequestOtp(this.numberForm.get('mobile_number')?.value).subscribe(() => {
      this.optSent = true;
    }));
  }

  resetPassword() {
    this.subs.add(this.userService.resetPasswordVerifyOtpAndSetPassword(this.resetPasswordForm.value).subscribe(() => {
      this.toaster.success('Success', 'Your password has been reset successfully');
      this.router.navigateByUrl('/');
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
