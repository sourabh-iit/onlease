import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subscription } from 'rxjs';

import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import * as $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public isLoggedIn = false;
  public user: User|null = null;
  public subs = new Subscription();

  @ViewChild('sidenav', {static: true}) public sidenav: MatSidenav;

  constructor(
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {
    this.subs.add(this.userService.isLoggedIn$.subscribe((val: boolean) => {
      this.isLoggedIn = val;
    }));
    this.subs.add(this.userService.user$.subscribe((data: any) => {
      this.user = data;
    }));
    setInterval(() => {
      for (let i = 0; i < window.frames.length; i++) {
        let $doc = $(window.frames[i].document);
        $doc.find('a[href*="tawk.to"]').remove();
      }
    }, 2000);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  isOwner() {
    const user = this.user!;
    return user.user_type == 'owner' || user.user_type == 'admin';
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.document.location.href = '/user/login';
    })
  }

  routeTo(url: string) {
    this.sidenav.close();
    this.router.navigateByUrl(url);
  }
}
