import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from "jquery";
import * as moment from 'moment';

import { ConstantsService } from 'src/app/services/constants.service';
import { UserService } from 'src/app/services/user.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { LodgingService } from 'src/lodging/services/lodging.service';

@Component({
  selector: 'app-lodging-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class LodgingDetailsComponent implements AfterViewInit, OnDestroy {
  public lodging: any;
  public subs = new Subscription();
  public me: User;
  public currImage = 0;
  public isFavorite = false;

  @ViewChild('carousel') carousel: any;
  private prevButton: any = null;
  private nextButton: any = null;

  constructor(
    private userService: UserService,
    private constantsService: ConstantsService,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private lodgingService: LodgingService
  ) {
    this.subs.add(this.route.data.subscribe((data) => {
      this.lodging = data.lodging;
    }));
    this.subs.add(this.userService.user$.subscribe((user: any) => {
      this.me = user;
      this.setIsFavorite();
    }));
  }

  ngAfterViewInit() {
    let $elem = $(this.carousel.elementRef.nativeElement);
    this.prevButton = $elem.find('.carousel-arrow-prev');
    this.nextButton = $elem.find('.carousel-arrow-next');
    this.prevButton.click(() => {
      if(this.currImage > 0) {
        this.currImage -= 1;
      }
    });
    this.nextButton.click(() => {
      if(this.currImage < this.lodging.images.length - 1) {
        this.currImage += 1;
      }
    });
  }

  get type() {
    const type = this.constantsService.lodgingTypes.find((t: any) => t.value == this.lodging.lodging_type)!;
    if(type.value == '4') {
      return this.lodging.lodging_type_other;
    }
    return type.text;
  }

  get furnishing() {
    const type = this.constantsService.furnishingTypes.find((t: any) => t.value == this.lodging.furnishing)!;
    return type!.text;
  }

  get flooring() {
    const type = this.constantsService.flooringOptions.find((t: any) => t.value == this.lodging.flooring)!;
    if(type.value == '4') {
      return this.lodging.flooring_other;
    }
    return type.text;
  }

  get areaUnit() {
    let index = this.constantsService.areaUnitOptions.findIndex(option => option.value == this.lodging.unit);
    if(index < 0) {
      index = 1;
    }
    return this.constantsService.areaUnitOptions[index].text;
  }

  get phoneNumbers() {
    let numbers: any[] = [];
    if(this.lodging.posted_by) {
      numbers = Array.from(this.lodging.posted_by.mobile_numbers);
      numbers.push(this.lodging.posted_by.mobile_number);
    }
    return numbers.join(', ');
  }
  
  get oneMonthRent() {
    const charges = this.lodging.charges.filter((charge: any) => charge.is_per_month);
    const totalCharge = charges.reduce((acc: number, currVal: any) => acc + parseInt(currVal.amount), 0);
    return parseInt (this.lodging.rent) + totalCharge;
  }

  get firstMonthRent() {
    return this.lodging.charges.reduce((acc: number, currVal: any) => acc + parseInt(currVal.amount), 0) + parseInt(this.lodging.rent)*this.lodging.advance_rent_of_months;
  }

  get needToConfirm() {
    const last_confirmed = moment(this.lodging.last_confirmed);
    return moment.duration(moment().diff(last_confirmed)).asHours() >= 24;
  }

  tagText(image: any) {
    let tag = "Unknown";
    const tagId = image.tag;
    const index = this.constantsService.tags.findIndex((tag: any) => tag.value == tagId);
    if(index > -1) {
      tag = this.constantsService.tags[index].text;
      if(tag == 'Other') {
        tag = image.tag_other;
      }
    }
    return tag;
  }

  setIsFavorite() {
    if(this.lodging) {
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

  confirmVaccant() {
    this.subs.add(this.lodgingService.confirmVaccant(this.lodging.id).subscribe(() => {
      this.toasterService.success('Success', 'We have placed the request. We will shortly sen an sms with owner\'s response');
    }));
  }

  bookLodging() {
    this.subs.add(this.lodgingService.bookLodging(this.lodging.id).subscribe((resp: any) => {
      window.open(resp.url);
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
