import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-accept-delete',
  templateUrl: './accept-delete.component.html',
  styleUrls: ['./accept-delete.component.scss']
})
export class AcceptDeleteComponent {
  
  constructor(private dialgoRef: MatDialogRef<AcceptDeleteComponent>) { }

  public denyDelete(): void {
    this.dialgoRef.close(false);
  }

  public acceptDelete(): void {
    this.dialgoRef.close(true);
  }
}
