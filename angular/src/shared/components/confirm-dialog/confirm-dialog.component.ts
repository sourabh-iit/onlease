import { Component, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  public subs = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    data.title = data.title || "Are you sure?";
    data.content = data.content || "This action cannot be undone.";
    data.confirmText = data.confirmText || "Yes";
    data.cancelText = data.cancelText || "No";
  }
}
