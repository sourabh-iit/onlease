import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";


export interface DialogData {
    addresses?: Address[];
  }

@Component({
    templateUrl: './address-choice.component.html',
    styleUrls: ['./address-choice.component.scss']
})
export class AddressChoiceComponent {
    public selectedAddress = '';
    
    constructor(
        public dialogRef: MatDialogRef<AddressChoiceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private router: Router
    ) {
        
    }

    newAddress() {
        this.router.navigateByUrl('/user/address/-1');
        this.dialogRef.close();
    }
}