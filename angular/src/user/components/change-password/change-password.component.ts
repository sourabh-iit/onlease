import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';

import { UserService } from 'src/app/services/user.service';

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('new_password');
  const confirm_password = control.get('confirm_password');

  if(confirm_password && password && confirm_password.value != password.value) {
    return { password_mismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnDestroy {
  public subs = new Subscription();
  public changePasswordForm = this.fb.group({
    current_password: ['', [Validators.required]],
    new_password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required]]
  }, {validators: confirmPasswordValidator});

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toaster: ToasterService
  ) {
  }

  changePassword() {
    this.subs.add(this.userService.changePassword(this.changePasswordForm.value).subscribe(() => {
      this.toaster.success('Success', 'Your password has been changed successfully')
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
