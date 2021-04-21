import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { ToasterService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

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

  @ViewChild('fileUpload') fileUpload: ElementRef;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toaster: ToasterService,
    private dialog: MatDialog,
    private router: Router
  ) {
    userService.getProfile();
    this.subs.add(userService.user$.subscribe((data: any) => {
      this.user = data != null ? data : {};
      this.profileForm.patchValue(this.user);
    }));
  }

  saveProfile() {
    this.subs.add(this.userService.saveProfile(this.profileForm.value).subscribe(() => {
      this.toaster.success('Success', 'Profile updated');
      this.router.navigateByUrl('/');
    }));
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    this.userService.uploadProfileImage(formData).subscribe((data: any) => {
      this.fileUpload.nativeElement.value = "";
    });
  }

  removeProfileImage() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        title: 'Are you sure?',
        content: 'This will remove your current profile image permanently',
        cancelText: 'No',
        confirmText: 'Yes'
      }
    });
    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if(yes) {
        this.userService.removeProfileImage().subscribe(() => {
          this.toaster.success('Success', 'Profile image removed')
        });
      }
    });
  }

  deleteNumber(number: MobileNumber) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        title: 'Are you sure?',
        content: 'Are you sure you want to delete this mobile number permanently?',
        cancelText: 'No',
        confirmText: 'Yes'
      }
    });
    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if(yes) {
        this.userService.deleteNumber(number).subscribe(() => {});
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
