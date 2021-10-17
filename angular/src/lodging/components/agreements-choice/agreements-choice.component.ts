import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";


export interface DialogData {
    agreements?: Agreement[];
    agreement_id: string;
  }

@Component({
    templateUrl: './agreements-choice.component.html',
    styleUrls: ['./agreements-choice.component.scss']
})
export class AgreementChoiceComponent {
    public selectedAgreement = -1;
    
    constructor(
        public dialogRef: MatDialogRef<AgreementChoiceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private router: Router
    ) {
       this.selectedAgreement = parseInt(data.agreement_id); 
       console.log(this.selectedAgreement);
    }

    newAgreement() {
        this.router.navigateByUrl('/user/agreements/-1');
        this.dialogRef.close();
    }
}