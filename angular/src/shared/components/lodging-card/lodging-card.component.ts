import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';
import { UserService } from 'src/app/services/user.service';

import * as moment from "moment";
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from 'src/app/services/toaster.service';
import { Router } from '@angular/router';
import { VirtualTourComponent } from '../virutal-tour/virtual-tour.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lodging-card',
  templateUrl: './lodging-card.component.html',
  styleUrls: ['./lodging-card.component.scss']
})
export class LodgingCardComponent implements OnDestroy {
  private _lodging: Lodging;

  @Input()
  set lodging(l: Lodging) {
    this._lodging = l;
    this.setIsFavorite();
  }

  get lodging() {
    return this._lodging;
  }

  public subs = new Subscription();
  public currImage = 0;
  public me: any = {};
  public isFavorite = false;

  constructor(
    private userService: UserService,
    private constantsService: ConstantsService,
    private dialog: MatDialog,
    private toasterService: ToasterService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.subs.add(this.userService.user$.subscribe((user: any) => {
      this.me = user;
      this.setIsFavorite();
    }));
  }

  get availableFrom() {
    if (this.lodging.available_from) {
      const available_from = this.toDate(this.lodging.available_from);
      return this.datePipe.transform(available_from);
    }
    return "Unknown"
  }

  get lodgingType() {
    const type = this.constantsService.lodgingTypes.find((t: any) => t.value == this.lodging.lodging_type)!;
    if(type.value == '4') {
      return this.lodging.lodging_type_other;
    }
    return type!.text;
  }

  get lodgingFurnishing() {
    const type = this.constantsService.furnishingTypes.find((t: any) => t.value == this.lodging.furnishing)!;
    return type!.text;
  }

  onButtonClick(action: string) {
    if(action == 'details') {
      this.router.navigateByUrl(`/lodgings/details/${this.lodging.id}`);
    } else if(action == 'tour') {
      this.dialog.open(VirtualTourComponent, {
        data: {
          tourLink: this.lodging.virtual_tour_link
        },
        width: "100%",
        height: "100%",
        panelClass: "virtual-tour-dialog"
      });
    }
  }

  setIsFavorite() {
    if(this.lodging && this.me) {
      if(this.me.favorites && this.me.favorites.indexOf(this.lodging.id) > -1) {
        this.isFavorite = true;
      } else {
        this.isFavorite = false;
      }
    }
  }

  favorite() {
    let addToFavorites = true;
    if(this.me.favorites.indexOf(this.lodging.id) > -1) {
      addToFavorites = false;
    }
    this.subs.add(this.userService.toggleFavorite(this.lodging.id).subscribe(() => {
      if(addToFavorites) {
        this.toasterService.success('Success', 'Added to favorites');
      } else {
        this.toasterService.success('Success', 'Removed from favorites');
      }
    }));
  }

  hasPrevImage() {
    if(this.currImage > 0) {
      return true;
    }
    return false;
  }

  hasNextImage() {
    if(this.lodging.images.length > this.currImage+1) {
      return true;
    }
    return false;
  }

  prevImage() {
    this.currImage--;
  }

  nextImage() {
    this.currImage++;
  }

  disable() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Hide ad from users?',
        content: 'Users will no longer be able to book this ad. Are you sure you want to do this?'
      }
    });
    this.subs.add(dialogRef.afterClosed().subscribe((res: boolean) => {
      if(res) {
        this.userService.disableLodging(this.lodging.id).subscribe(() => {
          this.lodging.isHidden = true;
        });
      }
    }));
  }

  enable() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Show ad to users?',
        content: 'Users will be able to book this ad. Are you sure you want to do this?'
      }
    });
    this.subs.add(dialogRef.afterClosed().subscribe((res: boolean) => {
      if(res) {
        this.userService.enableLodging(this.lodging.id).subscribe(() => {
          this.lodging.isHidden = false;
        });
      }
    }));
  }

  duplicate() {
    this.userService.duplicateLodging(this.lodging.id).subscribe((data: Lodging) => {
      this.router.navigateByUrl(`/lodgings/edit/${data.id}`);
    })
  }

  toDate(date: string) {
    return moment(date, "DD-MM-YYYY").toDate();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
