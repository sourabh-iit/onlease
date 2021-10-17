import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
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
import { AddressChoiceComponent } from '../address-choice/address-choice.component';

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

const dateFormat = 'DD-MM-YYYY';

@Component({
  selector: 'app-edit-lodging',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditLodgingComponent implements OnInit, OnDestroy {
  public subs = new Subscription();
  public lodgingForm: any;
  public user: User|null = null;
  public lodgingId = -1;
  public lodging: any = {};
  public images: LodgingImage[] = [];

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

  public addresses: Address[] = [];
  public selectedAddress: Address|null = null;

  public vrImages: any = [];
  public uploadingVRImages: any = [];
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  private localStorageKey = "";
  private lastSavedData = "";
  public formChanged = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private lodgingService: LodgingService,
    private dialog: MatDialog,
    private toastr: ToasterService,
    private constantsService: ConstantsService,
    private router: Router,
    private userService: UserService,
    private modalService: MatDialog
  ) {
  }

  ngOnInit() {
    this.furnishingOptions = this.constantsService.furnishingTypes;
    this.facilityOptions = this.constantsService.facilities;
    this.areaUnitOptions = this.constantsService.areaUnitOptions;
    this.flooringOptions = this.constantsService.flooringOptions;

    this.subs.add(this.route.paramMap.subscribe((paramMap: any) => {
      this.lodgingId = parseInt(paramMap.get('lodgingId')!);
      this.createLodgingForm();
      this.subs.add(this.userService.user$.subscribe((data: User|null) => {
        if(data) {
          this.user = data;
          this.localStorageKey = `lodging-form-data:${this.user!.mobile_number}`;
          if(this.lodgingId > 0) {
            this.loadLodging();
          } else {
            const localData = this.retrieveForm();
            if(localData != null) {
              this.lastSavedData = JSON.stringify(localData);
              this.populateForm(localData);
            }
          }
        }
      }));
    }));
    for(let i=0; i<20; i++) {
      this.totalfloorOptions.push({text: i+1, value: i+1});
    }
    this.lodgingTypes = this.constantsService.lodgingTypes;
    this.loadAgreements();
    this.loadAddresses();
  }

  private createLodgingForm() {
    this.lodgingForm = this.fb.group({
      address_id: ['', [Validators.required]],
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
      charges: this.fb.array([])
    }, { validator: crossFieldValidator});
    this.subs.add(this.lodgingForm.valueChanges.subscribe(() => this.saveForm()));
    this.subs.add(this.lodgingForm.get('total_floors')!.valueChanges.subscribe((val: any) => {
      let totalFloors = parseInt(val);
      this.floorNumOptions = [];
      for(let i=0; i<totalFloors; i++) {
        this.floorNumOptions.push({text: i+1, value: i+1});
      }
    }));
    this.subs.add(this.lodgingForm.get('virtual_tour_link')!.valueChanges.subscribe((val: string) => {
      this.validateTourLink(val);
    }));
    this.images = [];
    this.vrImages = [];
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

  loadAddresses() {
    this.subs.add(this.userService.loadAddresses().subscribe((addresses: any) => {
      this.addresses = addresses;
      this.selectAddress();
    }));
  }

  selectAgreement() {
    const agreementId = this.lodgingForm.get('agreement_id').value;
    if(agreementId != '' && this.agreements.length > 0) {
      const index = this.agreements.findIndex((agreement: Agreement) => agreement.id == agreementId);
      if(index > -1) {
        this.selectedAgreement = this.agreements[index];
      } else {
        this.lodgingForm.get('agreement_id').setValue('');
      }
    }
  }

  selectAddress() {
    const addressId = this.lodgingForm.get('address_id').value;
    if(addressId != '' && this.addresses.length > 0) {
      const index = this.addresses.findIndex((address: Address) => address.id == addressId);
      if(index > -1) {
        this.selectedAddress = this.addresses[index];
      } else {
        this.lodgingForm.get('address_id').setValue('');
      }
    }
  }

  deselectAgreement() {
    this.lodgingForm.get('address_id').setValue('');
    this.selectedAgreement = null;
  }

  getAgreementById(agreementId: number) {
    return this.agreements.find((agreement: Agreement) => agreement.id == agreementId);
  }

  getAddressById(addressId: number) {
    return this.addresses.find((address: Address) => address.id == addressId);
  }

  chooseAgreement() {
    const modalRef = this.modalService.open(AgreementChoiceComponent, {
      data: {
        agreements: this.agreements,
        agreement_id: this.lodgingForm.get('agreement_id').value
      },
      panelClass: 'agreement-dialog'
    });
    modalRef.afterClosed().subscribe((agreementId: number) => {
      if(agreementId) {
        this.selectedAgreement = this.agreements.find((a: Agreement) => a.id == agreementId)!;
        this.lodgingForm.get('agreement_id').setValue(agreementId);
        this.saveForm();
      }
    });
  }

  chooseAddress() {
    const modalRef = this.modalService.open(AddressChoiceComponent, {
      data: {
        addresses: this.addresses,
        selectedId: this.lodgingForm.get('address_id').value
      },
      panelClass: 'address-dialog'
    });
    modalRef.afterClosed().subscribe((addressId: number) => {
      if(addressId) {
        this.selectedAddress = this.addresses.find((a: Address) => a.id == addressId)!;
        this.lodgingForm.get('address_id').setValue(addressId);
        this.saveForm();
      }
    });
  }

  removeCharge(index: number) {
    this.charges.removeAt(index);
  }

  get tomorrow() {
    return new Date(Date.now()+24*60*60*1000);
  }

  get tourLinkControl() {
    return this.lodgingForm.get('virtual_tour_link')!;
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
    const dialogRef = this.dialog.open(LodgingImageComponent, {
      disableClose: true,
      data: { lodgingId: this.lodgingId }
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.images.push(data);
        this.lastSavedData = JSON.stringify(this.createSaveData());
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
      if(this.lodgingId > 0) {
        formData.append('lodgingId', this.lodgingId.toString());
      }
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
          this.lastSavedData = JSON.stringify(this.createSaveData());
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

  getFileName(link: string) {
    const arr = link.split('/');
    return arr[arr.length-1];
  }

  editImage(image: any) {
    const dialogRef = this.dialog.open(LodgingImageComponent, {
      disableClose: true,
      data: {
        image: image
      }
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
      if(data.address_id == null) {
        data.address_id = '';
      } else {
        data.address_id = data.address_id.toString();
      }
      this.populateForm(data);
      this.lastSavedData = JSON.stringify(this.createSaveData());
      this.formChanged = false;
    }));
  }

  saveLodging() {
    const data = this.createSaveData();
    this.lastSavedData = JSON.stringify(data);
    if(data.agreement_id == '') {
      delete data.agreement_id;
    }
    if(data.address_id == '') {
      delete data.address_id;
    }
    data.images = data.images.map((image: any) => image.id);
    data.vrimages = data.vrimages.map((image: any) => image.id);
    data.id = this.lodgingId;
    if(this.lodgingId > 0) {
      this.subs.add(this.lodgingService.update(data).subscribe(() => {
        this.toastr.success('Success!', 'Ad updated');
        this.formChanged = false;
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
      data.available_from = data.available_from.format(dateFormat);
    }
    return data;
  }

  populateForm(data: Lodging) {
    this.images = data.images ? data.images : [];
    this.vrImages = data.vrimages ? data.vrimages : [];
    data.available_from = data.available_from == null ? "" : moment(data.available_from, dateFormat);
    data.facilities = JSON.parse(data.facilities);
    for(let charge of data.charges) {
      this.addNewCharge();
      this.charges.controls[this.charges.length-1].patchValue(charge);
    }
    this.lodgingForm.patchValue(data);
    this.lodgingForm.patchValue({ region_temp: data.region });
    this.selectAgreement();
    this.selectAddress();
  }

  deleteForm() {
    localStorage.removeItem(this.localStorageKey);
  }

  saveForm() {
    const data = JSON.stringify(this.createSaveData());
    if(this.lastSavedData != data) {
      this.formChanged = true;
    } else {
      this.formChanged = false;
    }
    if(this.lodgingId < 0) {
      localStorage.setItem(this.localStorageKey, data);
    }
  }

  retrieveForm() {
    const data = localStorage.getItem(this.localStorageKey);
    if(data != null) {
      return JSON.parse(data);
    }
    return null;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}