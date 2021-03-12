import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm_password = control.get('confirm_password');

  if(confirm_password && password && confirm_password.value != password.value) {
    return { password_mismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-user-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  public subs = new Subscription();
  public registerForm = this.fb.group({
    mobile_number: ['', [Validators.required, Validators.pattern(/^[789]\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required]],
    first_name: [''],
    last_name: [''],
    email: ['']
  }, {validators: confirmPasswordValidator});
  public otpSent = false;
  public lastOtpSent = Date.now();

  constructor(
    public userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  register() {
    this.subs.add(this.userService.register(this.registerForm.value).subscribe(() => {
      this.otpSent = true;
    }));
  }

  onResendOtp() {
    this.subs.add(this.userService.resendOtp().subscribe(() => {
      this.lastOtpSent = Date.now();
    }));
  }

  onVerifyOtp(otp: string) {
    this.subs.add(this.userService.verify_registration(otp).subscribe(() => {
      this.router.navigateByUrl("/user/me/profile");
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
