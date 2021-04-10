import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";


export interface DialogData {
  tourLink: string;
}

@Component({
    templateUrl: "./virtual-tour.component.html",
    styleUrls: ['./virtual-tour.component.scss']
})
export class VirtualTourComponent {
    public tourLink: SafeResourceUrl;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private sanitizer: DomSanitizer,
        public dialogRef: MatDialogRef<VirtualTourComponent>
    ) {
        this.tourLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.tourLink);
    }
}