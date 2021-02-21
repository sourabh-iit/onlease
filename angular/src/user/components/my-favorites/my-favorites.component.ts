import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.scss']
})
export class MyFavoritesComponent implements OnDestroy {
  public subs = new Subscription();
  public lodgings: Lodging[] = [];

  constructor(
    private userService: UserService
  ) {
    this.subs.add(this.userService.favorites$.subscribe((data: Lodging[]) => {
      this.lodgings = data;
    }));
    this.subs.add(userService.loadMyFavorites().subscribe(() => {}));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
