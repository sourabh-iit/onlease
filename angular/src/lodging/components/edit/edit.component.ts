import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { RegionsService } from 'src/app/services/regions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LodgingService } from 'src/lodging/services/lodging.service';
import { finalize } from 'rxjs/operators';
import { LodgingImageComponent } from '../image/image.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToasterService } from 'src/app/services/toaster.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { HttpEventType } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { AgreementChoiceComponent } from '../agreements-choice/agreements-choice.component';

export const crossFieldValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const lodgingTypeControl = control.get('lodging_type')!;
  const lodgingTypeOtherControl = control.get('lodging_type_other')!;
  const flooringControl = control.get('flooring')!;
  const flooringOtherControl = control.get('flooring_other')!;
  const isBookedControl = control.get('is_booked')!;
  const availableFromControl = control.get('available_from')!;

  if(lodgingTypeControl.value == '4' && lodgingTypeOtherControl.value == '') {
    lodgingTypeOtherControl.setErrors({required: true});
  } else {
    lodgingTypeOtherControl.setErrors(null);
  }
  if(flooringControl.value == '10' && flooringOtherControl.value == '') {
    flooringOtherControl.setErrors({required: true});
  } else {
    flooringOtherControl.setErrors(null);
  }
  if(isBookedControl.value == true && availableFromControl.value == '') {
    availableFromControl.setErrors({required: true});
  } else {
    availableFromControl.setErrors(null);
  }

  return null;
};

@Component({
  selector: 'app-edit-lodging',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditLodgingComponent implements OnInit, OnDestroy {
  public subs = new Subscription();
  public lodgingForm: any;
  public user: any = {};
  public lodgingId = -1;
  public lodging: any = {};
  public images: LodgingImage[] = [];

  public regions: Region[] = [];
  public loadingRegions = false;
  public validatingLink = false;

  public lodgingTypes: any;
  public totalfloorOptions: any = [];
  public floorNumOptions: any = [];
  public furnishingOptions: any = [];
  public facilityOptions: any = [];
  public areaUnitOptions: any = [];
  public flooringOptions: any = [];

  public agreements: Agreement[] = [];
  public selectedAgreement: Agreement|null = null;

  public vrImages: any = [];
  public uploadingVRImages: any = [];
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private regionsService: RegionsService,
    private route: ActivatedRoute,
    private lodgingService: LodgingService,
    private dialog: MatDialog,
    private toastr: ToasterService,
    private constantsService: ConstantsService,
    private router: Router,
    private userService: UserService,
    private modalService: MatDialog
  ) {
    this.subs.add(this.route.params.subscribe(params => {
      this.lodgingForm = this.createLodgingForm();
      this.images = [];
      this.lodgingId = parseInt(params['lodgingId']);
      if(this.lodgingId > 0) {
        this.loadLodging();
      } else {
        const localData = this.retrieveForm();
        if(localData != null) {
          this.populateForm(localData);
        }
        this.subs.add(this.lodgingForm.valueChanges.subscribe(() => this.saveForm()));
        this.getLocation();
      }
    }));
  }

  ngOnInit() {
    this.furnishingOptions = this.constantsService.furnishingTypes;
    this.facilityOptions = this.constantsService.facilities;
    this.areaUnitOptions = this.constantsService.areaUnitOptions;
    this.flooringOptions = this.constantsService.flooringOptions;
    this.subs.add(this.lodgingForm.get('region_temp')!.valueChanges.subscribe((query: any) => {
      if(this.regionControl.value == '') {
        this.regionTempControl.setErrors({'required': true});
      }
      this.subs.add(this.regionsService.loadRegions(query).subscribe((data: any) => {
        this.regions = data;
      }));
    }));
    this.subs.add(this.lodgingForm.get('total_floors')!.valueChanges.subscribe((val: any) => {
      let totalFloors = parseInt(val);
      this.floorNumOptions = [];
      for(let i=0; i<totalFloors; i++) {
        this.floorNumOptions.push({text: i+1, value: i+1});
      }
    }));
    for(let i=0; i<20; i++) {
      this.totalfloorOptions.push({text: i+1, value: i+1});
    }
    this.subs.add(this.lodgingForm.get('virtual_tour_link')!.valueChanges.subscribe((val: string) => {
      this.validateTourLink(val);
    }));
    this.lodgingTypes = this.constantsService.lodgingTypes;
    this.loadAgreements();
  }

  private createLodgingForm() {
    return this.fb.group({
      address: ['', [Validators.required]],
      region: ['', [Validators.required]],
      lodging_type: ['3', [Validators.required]],
      lodging_type_other: [''],
      total_floors: ['', [Validators.required]],
      floor_no: ['', [Validators.required]],
      furnishing: ['1', [Validators.required]],
      facilities: [[]],
      rent: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      area: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      unit: ['0', [Validators.required]],
      bathrooms: ['1', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      rooms: ['1', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      balconies: ['0', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      halls: ['0', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      advance_rent_of_months: ['1', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      flooring: ['5', [Validators.required]],
      flooring_other: [''],
      additional_details: [''],
      is_booked: [false, [Validators.required]],
      available_from: [''],
      latlng: [''],
      virtual_tour_link: [''],
      agreement_id: [''],
      region_temp: ['', [Validators.required]],
      charges: this.fb.array([])
    }, { validator: crossFieldValidator});
  }

  get charges() {
    return this.lodgingForm.get('charges') as FormArray;
  }

  addNewCharge() {
    this.charges.push(this.fb.group({
      amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
      is_per_month: [false],
    }));
  }

  loadAgreements() {
    this.subs.add(this.userService.loadAgreements().subscribe((agreements: any) => {
      this.agreements = agreements;
      this.selectAgreement();
    }));
  }

  selectAgreement() {
    const agreementId = this.lodgingForm.get('agreement_id').value;
    if(agreementId != '') {
      const index = this.agreements.findIndex((agreement: Agreement) => agreement.id == agreementId);
      if(index > -1) {
        this.selectedAgreement = this.agreements[index];
      } else {
        this.lodgingForm.get('agreement_id').setValue('');
      }
    }
  }

  deselectAgreement() {
    this.lodgingForm.get('agreement_id').setValue('');
    this.selectedAgreement = null;
  }

  getAgreementById(agreementId: number) {
    return this.agreements.find((agreement: Agreement) => agreement.id == agreementId);
  }

  chooseAgreement() {
    const modalRef = this.modalService.open(AgreementChoiceComponent, {
      data: {
        agreements: this.agreements
      }
    });
    modalRef.afterClosed().subscribe((agreementId: number) => {
      if(agreementId) {
        this.selectedAgreement = this.agreements.find((a: Agreement) => a.id == agreementId)!;
        this.lodgingForm.get('agreement_id').setValue(agreementId);
      }
    });
  }

  removeCharge(index: number) {
    this.charges.removeAt(index);
  }

  get tomorrow() {
    return new Date(Date.now()+24*60*60*1000);
  }

  private getLocation() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        const coords = location.coords;
        this.lodgingForm.get('latlng')!.setValue(`${coords.latitude},${coords.longitude},${coords.accuracy}`);
      });
    }
  }

  get regionControl() {
    return this.lodgingForm.get('region')!;
  }

  get regionTempControl() {
    return this.lodgingForm.get('region_temp')!;
  }

  get tourLinkControl() {
    return this.lodgingForm.get('virtual_tour_link')!;
  }

  displayRegionFn(value: any) {
    if(value) {
      return `${value.name} (${value.state.name})`;
    }
    return "";
  }

  private validateTourLink(link: string) {
    if(link == '') {
      this.tourLinkControl.setErrors(null);
      return;
    }
    this.validatingLink = true;
    this.subs.add(this.lodgingService.validateTourLink(link).pipe(
      finalize(() => this.validatingLink = false)
    ).subscribe((data: any) => {
      this.validatingLink = false;
      if(!data.is_valid) {
        this.tourLinkControl.setErrors({invalid: true});
      } else {
        this.tourLinkControl.setErrors(null);
      }
    }, () => {
      this.tourLinkControl.setErrors({invalid: true});
    }));
  }

  addNewImage() {
    const dialogRef = this.dialog.open(LodgingImageComponent, {disableClose: true});
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.images.push(data);
        this.saveForm();
      }
    });
  }

  onFileAdded(event: any) {
    let file;
    for(file of event.target.files) {
      let uploadVRImage = {src: '', percent: 0};
      let formData = new FormData();
      formData.append('image', file);
      const reader = new FileReader();
      reader.onload = e => {
        uploadVRImage.src = <string> reader.result;
        this.uploadingVRImages.push(uploadVRImage);
      }
      reader.readAsDataURL(file);
      this.subs.add(this.lodgingService.uploadLodgingVRImage(formData).subscribe((resp: any) => {
        if (resp.type === HttpEventType.Response) {
          if(this.uploadingVRImages.filter((im: any) => im.percent < 100).length == 0) {
            this.uploadingVRImages = [];
          }
          this.vrImages.push(resp.body);
          this.saveForm();
        }
        if (resp.type === HttpEventType.UploadProgress) {
          uploadVRImage.percent = Math.round(100 * resp.loaded / resp.total);
        }
      }));
    }
    this.fileUpload.nativeElement.value = '';
  }

  filterUploadedImages(images: any) {
    return images.filter((im: any) => im.percent < 100);
  }

  removeVRImage(image: LodgingVRImage) {
    // TODO: confirm popup
    this.lodgingService.deleteLodgingVRImage(image.id).subscribe(() => {
      this.vrImages = this.vrImages.filter((im: any) => im.id != image.id);
      this.saveForm();
    });
  }

  downloadVRImage(image: LodgingVRImage) {

  }

  getFileName(link: string) {
    const arr = link.split('/');
    return arr[arr.length-1];
  }

  editImage(image: any) {
    const dialogRef = this.dialog.open(LodgingImageComponent, {
      disableClose: true,
      data: image
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        const index = this.images.findIndex(im => im.id == image.id);
        this.images[index] = data;
        this.saveForm();
      }
    });
  }

  removeLodgingImage(image: LodgingImage) {
    // TODO: confirm popup
    this.lodgingService.deleteLodgingImage(image.id).subscribe(() => {
      this.images = this.images.filter((im: any) => im.id != image.id);
      this.saveForm();
    });
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

  loadLodging() {
    this.subs.add(this.lodgingService.loadLodging(this.lodgingId).subscribe((data: any) => {
      if(data.agreement_id == null) {
        data.agreement_id = '';
      } else {
        data.agreement_id = data.agreement_id.toString();
      }
      this.populateForm(data);
    }));
  }

  saveLodging() {
    const data = this.createSaveData();
    delete data.region;
    if(data.agreement_id == '') {
      delete data.agreement_id;
    }
    data.images = data.images.map((image: any) => image.id);
    data.vrimages = data.vrimages.map((image: any) => image.id);
    data.id = this.lodgingId;
    if(this.lodgingId > 0) {
      this.subs.add(this.lodgingService.update(data).subscribe(() => {
        this.toastr.success('Success!', 'Ad updated');
      }));
    } else {
      this.subs.add(this.lodgingService.create(data).subscribe(() => {
        this.deleteForm();
        this.router.navigateByUrl('/user/me/ads');
      }));
    }
  }

  createSaveData() {
    const data = Object.assign({}, this.lodgingForm.value);
    data.images = this.images;
    data.vrimages = this.vrImages;
    data.facilities = JSON.stringify(data.facilities);
    if(data.available_from == "") {
      delete data.available_from;
    } else {
      data.available_from = data.available_from.format('YYYY-MM-DD');
    }
    data.region_id = data.region.id;
    delete data.region_temp;
    return data;
  }

  populateForm(data: Lodging) {
    this.images = data.images;
    this.vrImages = data.vrimages ? data.vrimages : [];
    if(data.region) {
      this.regions = [data.region];
    }
    data.available_from = data.available_from == null ? "" : moment(data.available_from, "YYYY-MM-DD");
    data.facilities = JSON.parse(data.facilities);
    for(let charge of data.charges) {
      this.addNewCharge();
      this.charges.controls[this.charges.length-1].patchValue(charge);
    }
    this.lodgingForm.patchValue(data);
    this.lodgingForm.patchValue({ region_temp: data.region });
    this.selectAgreement();
  }

  deleteForm() {
    localStorage.removeItem('lodging-form-data');
  }

  saveForm() {
    const data = this.createSaveData();
    localStorage.setItem("lodging-form-data", JSON.stringify(data));
  }

  retrieveForm() {
    const data = localStorage.getItem("lodging-form-data");
    if(data != null) {
      return JSON.parse(data);
    }
    return null;
  }

  onRegionSelected(event: MatAutocompleteSelectedEvent) {
    this.regionTempControl.setErrors(null);
    this.regionControl.setValue(event.option.value);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}