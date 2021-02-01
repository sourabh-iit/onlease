import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnDestroy {
  public subs = new Subscription();
  public profileForm = this.fb.group({
    first_name: [''],
    last_name: [''],
    gender: [''],
    email: ['']
  });
  public user: any = {};

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toaster: ToasterService
  ) {
    userService.getProfile();
    this.subs.add(userService.user$.subscribe((data: any) => {
      console.log(data);
      this.user = data != null ? data : {};
      this.profileForm.patchValue(this.user);
    }));
  }

  saveProfile() {
    this.subs.add(this.userService.saveProfile(this.profileForm.value).subscribe(() => {
      this.toaster.success('Success', 'Profile updated')
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
