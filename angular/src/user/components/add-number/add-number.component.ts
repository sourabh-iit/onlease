import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-number',
  templateUrl: './add-number.component.html',
  styleUrls: ['./add-number.component.scss']
})
export class AddNumberComponent implements OnDestroy {
  public subs = new Subscription();
  public numberForm = this.fb.group({
    mobile_number: ['', [Validators.required, Validators.pattern(/[7-9][0-9]{9}/)]]
  });
  public otpSent = false;
  public lastOtpSent = Date.now();

  constructor(
    public userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  addNumber() {
    this.subs.add(this.userService.addNumber(this.numberForm.value).subscribe(() => {
      this.otpSent = true;
      this.lastOtpSent = Date.now();
    }));
  }

  onOtpVerified() {
    this.router.navigateByUrl('/user/me/profile');
  }

  onResendOtp() {
    this.subs.add(this.userService.resendOtpNumber().subscribe(() => {
      this.lastOtpSent = Date.now();
    }))
  }

  onVerifyOtp(otp: string) {
    this.subs.add(this.userService.verifyNumber(otp).subscribe(() => {
      this.router.navigateByUrl("/user/me/profile");
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
