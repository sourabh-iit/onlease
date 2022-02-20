import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { finalize } from "rxjs/operators";

import { RegionsService } from "src/app/services/regions.service";
import { ToasterService } from "src/app/services/toaster.service";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  public addressForm = this.fb.group({
    'text': ['', [Validators.required]],
    'google_place_main_text': ['', [Validators.required]],
    'google_place_secondary_text': ['', [Validators.required]],
    'google_place_id': ['', [Validators.required]],
    'place_text': ['', [Validators.required]],
    'latlng': ['']
  });
  public loadingAddress = false;
  public addressId: number;
  public savingAddress = false;
  public regions: Region[] = [];
  public loadingRegions = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private regionsService: RegionsService,
    private toaster: ToasterService,
    private router: Router
  ){
    this.addressId = parseInt(this.route.snapshot.paramMap.get('addressId')!);
  }
  
  ngOnInit(): void {
    if(this.addressId != -1) {
      this.loadAddress();
    }
    this.subs.add(this.placeTextControl?.valueChanges.subscribe((query: any) => {
      this.subs.add(this.regionsService.loadRegions(query).subscribe((data: any) => {
        this.regions = data;
      }));
    }));
    this.getLocation();
  }

  private getLocation() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        const coords = location.coords;
        this.addressForm.get('latlng')!.setValue(`${coords.latitude},${coords.longitude},${coords.accuracy}`);
      });
    }
  }

  get placeIdControl() {
    return this.addressForm.get('place_id')!;
  }

  get placeTextControl() {
    return this.addressForm.get('place_text')!;
  }

  displayRegionFn(value: Region) {
    if(value) {
      return `${value.main_text} (${value.secondary_text})`;
    }
    return "";
  }

  onRegionSelected(event: MatAutocompleteSelectedEvent) {
    const region: Region = event.option.value;
    this.addressForm.patchValue({
      google_place_id: region.place_id,
      google_place_main_text: region.main_text,
      google_place_secondary_text: region.secondary_text
    });
    console.log(this.addressForm.value);
  }

  private patchForm(address: Address) {
    const region = {
      main_text: address.google_place_main_text,
      secondary_text: address.google_place_secondary_text,
      place_id: address.google_place_id
    };
    this.addressForm.patchValue({
      ...address,
      place_text: region
    });
    this.regions = [region];
  }

  loadAddress() {
    this.loadingAddress = true;
    this.subs.add(this.userService.loadAddress(this.addressId).pipe(
      finalize(() => { this.loadingAddress = false; })
    ).subscribe((address: any) => {
      this.patchForm(address);
    }));
  }

  saveAddress() {
    this.savingAddress = true;
    let obs: Observable<any>;
    const data = this.addressForm.value;
    delete data.place_text;
    if(this.addressId == -1) {
        obs = this.userService.createAddress(data);
    } else {
        obs = this.userService.saveAddress(this.addressId, data);
    }
    this.subs.add(obs.pipe(
        finalize(() => { this.savingAddress = false; })
    ).subscribe((address: any) => {
        if(this.addressId == -1) {
          this.toaster.success('Success', 'Address created');
        } else {
            this.toaster.success('Success', 'Address saved');
        }
        this.router.navigateByUrl('/user/me/addresses');
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}