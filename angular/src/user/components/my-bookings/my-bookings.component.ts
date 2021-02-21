import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnDestroy {
  public subs = new Subscription();
  public lodgings: Lodging[] = [];

  constructor(
    private userService: UserService
  ) {
    this.subs.add(userService.loadMyBookings().subscribe((data: any) => {
      this.lodgings = data;
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
