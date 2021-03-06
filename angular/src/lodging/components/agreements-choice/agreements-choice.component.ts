import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";


export interface DialogData {
    agreements?: Agreement[];
  }

@Component({
    templateUrl: './agreements-choice.component.html',
    styleUrls: ['./agreements-choice.component.scss']
})
export class AgreementChoiceComponent {
    public selectedAgreement = '';
    
    constructor(
        public dialogRef: MatDialogRef<AgreementChoiceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private router: Router
    ) {
        
    }

    newAgreement() {
        this.router.navigateByUrl('/user/agreements/-1');
        this.dialogRef.close();
    }
}