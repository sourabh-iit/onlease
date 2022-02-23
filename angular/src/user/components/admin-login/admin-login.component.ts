import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-user-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnDestroy {
  public subs = new Subscription();
  public loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(/^[789]\d{9}$/)]]
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  login() {
    this.subs.add(this.userService.adminLogin(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl('/');
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
