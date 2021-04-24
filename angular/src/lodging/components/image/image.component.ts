import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';
import { LodgingService } from 'src/lodging/services/lodging.service';

export const tagValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const tag = control.get('tag');
  const tag_other = control.get('tag_other');

  if(tag && tag_other && tag.value == '11' && tag_other.value == '') {
    tag_other.setErrors({required: true});
  } else {
    tag_other!.setErrors(null);
  }
  return null;
};

interface DialogData {
  image: LodgingImage;
  lodgingId: number;
}

@Component({
  selector: 'app-lodging-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class LodgingImageComponent implements OnInit, OnDestroy {
  public subs = new Subscription();
  public tags: any = [];
  public imageForm = this.fb.group({
    tag: ['', [Validators.required]],
    tag_other: ['']
  }, {validators: tagValidator});
  public formData = new FormData();
  public imageSrc: string | ArrayBuffer | null = "";

  @ViewChild('fileUpload') fileUpload: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<LodgingImageComponent>,
    private lodgingService: LodgingService,
    private constantsService: ConstantsService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if(this.data.lodgingId) {
      this.formData.append('lodgingId', this.data.lodgingId.toString());
    }
  }

  ngOnInit() {
    if(this.data.image == null) {
      this.imageForm.addControl('url', this.fb.control(['', [Validators.required]]));
    } else {
      this.imageForm.patchValue(this.data.image);
    }
    this.tags = this.constantsService.tags;
  }

  onFileAdded(event: any) {
    const file = event.target.files[0];
    this.formData.append('image', file);
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(file);
  }

  saveImage() {
    this.formData.append('tag', this.imageForm.get('tag')!.value);
    this.formData.append('tag_other', this.imageForm.get('tag_other')!.value);
    if(this.data.image) {
      this.subs.add(this.lodgingService.updateImageTag(this.data.image.id, this.formData).subscribe((data: any) => {
        this.dialogRef.close(data);
      }));
    } else {
      this.subs.add(this.lodgingService.uploadLodgingImage(this.formData).subscribe((data) => {
        this.dialogRef.close(data);
      }));
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}