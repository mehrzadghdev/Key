import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogData, AlertDialogType } from '../../types/dialog.type';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  public get AlertTypeEnum(): typeof AlertDialogType {
    return AlertDialogType;
  }

  constructor(
    private dialgoRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData,
  ) { }

  public denyAlert(): void {
    this.dialgoRef.close(false);
  }

  public acceptAlert(): void {
    this.dialgoRef.close(true);
  }
}
