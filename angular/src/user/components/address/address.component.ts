import { Component, OnDestroy } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";

import { RegionsService } from "src/app/services/regions.service";
import { ToasterService } from "src/app/services/toaster.service";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnDestroy {
    private subs = new Subscription();
    public addressForm = this.fb.group({
        'text': ['', [Validators.required]],
        'region_temp': [''],
        'region': ['', [Validators.required]],
        'latlng': ['']
    });
    public loadingAddress = false;
    public addressId!: number;
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
        if(this.addressId != -1) {
            this.loadAddress();
        }
        this.subs.add(this.addressForm.get('region_temp')!.valueChanges.subscribe((query: any) => {
          if(this.regionControl.value == '') {
            this.regionTempControl.setErrors({'required': true});
          }
          this.subs.add(this.regionsService.loadRegions(query).subscribe((data: any) => {
            this.regions = data;
          }));
        }));
        this.getLocation();
    }

    get points() {
        return this.addressForm.get('points') as FormArray;
    }

    private getLocation() {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location) => {
          const coords = location.coords;
          this.addressForm.get('latlng')!.setValue(`${coords.latitude},${coords.longitude},${coords.accuracy}`);
        });
      }
    }

    get regionControl() {
      return this.addressForm.get('region')!;
    }
  
    get regionTempControl() {
      return this.addressForm.get('region_temp')!;
    }

    displayRegionFn(value: any) {
      if(value) {
        return `${value.name} (${value.state.name})`;
      }
      return "";
    }

    onRegionSelected(event: MatAutocompleteSelectedEvent) {
      this.regionTempControl.setErrors(null);
      this.regionControl.setValue(event.option.value);
    }

    private patchForm(address: Address) {
        this.addressForm.patchValue({
            text: address.text,
            latlng: address.latlng,
            region_temp: address.region,
            region: address.region
        });
        this.regions = [address.region];
        this.regionTempControl.setErrors(null);
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
        let obs: any;
        const data = this.addressForm.value;
        data.region_id = data.region.id;
        delete data.region;
        delete data.region_temp;
        if(this.addressId == -1) {
            obs = this.userService.createAddress(data);
        } else {
            obs = this.userService.saveAddress(this.addressId, data);
        }
        this.subs.add(obs.pipe(
            finalize(() => { this.savingAddress = false; })
        ).subscribe((address: any) => {
            if(this.addressId == -1) {
                this.router.navigateByUrl('/user/me/addresses');
            } else {
                this.patchForm(address);
                this.toaster.success('Success', 'Address saved');
            }
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}