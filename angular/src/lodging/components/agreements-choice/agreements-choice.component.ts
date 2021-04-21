import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";


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
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }
}