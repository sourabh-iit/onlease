import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-lodgings',
  templateUrl: './my-lodgings.component.html',
  styleUrls: ['./my-lodgings.component.scss']
})
export class MyLodgingsComponent implements OnDestroy {
  public subs = new Subscription();
  public lodgings: Lodging[] = [];

  constructor(
    private userService: UserService
  ) {
    this.loadMyLodgings();
  }
  
  loadMyLodgings() {
    this.subs.add(this.userService.loadMyLodgings().subscribe((data: any) => {
      this.lodgings = data;
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
