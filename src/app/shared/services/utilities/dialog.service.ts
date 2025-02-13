import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { DialogResult, DialogCSSClasses, DialogConfig, AlertDialogData } from '../../types/dialog.type';
import { AcceptDeleteComponent } from '../../components/accept-delete/accept-delete.component';
import { AlertComponent } from '../../components/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
  ) { }

  public openFullScreenDialog<T, R = any>(component: ComponentType<unknown>, config?: DialogConfig<T>): MatDialogRef<unknown, DialogResult<R>> {
    const dialogRef = this.open<T, R>(component, {
      data: config?.data,
      autoFocus: false,
      disableClose: true,
      hasBackdrop: true,
      panelClass: [DialogCSSClasses.FullScreenDialog]
    });

    return dialogRef;
  }

  public openFormDialog<T, R = any>(component: ComponentType<unknown>, config?: DialogConfig<T>): MatDialogRef<unknown, DialogResult<R>> {
    const dialogRef = this.open<T, R>(component, {
      data: config?.data,
      autoFocus: true,
      disableClose: true,
      hasBackdrop: false,
      width: config?.width,
      panelClass: [
        DialogCSSClasses.WindowDialog,
      ]
    });

    return dialogRef;
  }

  public openAlertDialog(alertData: AlertDialogData): MatDialogRef<any> {
    const dialogRef = this.dialog.open(AlertComponent, {
      autoFocus: true,
      disableClose: false,
      hasBackdrop: false,
      data: alertData,
      width:"456px",
      height: "auto",
      panelClass: [
        DialogCSSClasses.WindowDialog,
      ],
    });

    return dialogRef;
  }

  public openDialog<T, R = any>(component: ComponentType<unknown>, config?: DialogConfig<T>): MatDialogRef<unknown, DialogResult<R>> {
    const dialogRef = this.open<T, R>(component, {
      data: config?.data,
      autoFocus: false,
      disableClose: false,
      hasBackdrop: false,
      width: config?.width,
    });

    return dialogRef;
  }

  public openAcceptDeleteDialog(): MatDialogRef<any> {
    const dialogRef = this.dialog.open(AcceptDeleteComponent, {
      autoFocus: true,
      disableClose: false,
      hasBackdrop: false,
      width:"300px",
      height: "auto",
      panelClass: [
        DialogCSSClasses.ResponsiveDialog,
        DialogCSSClasses.WindowDialog,
      ],
    });

    return dialogRef;
  }


  private open<T, R>(component: ComponentType<unknown>, config: MatDialogConfig<T>): MatDialogRef<unknown, DialogResult<R>> {
    const dialogRef = this.dialog.open(component, {
      autoFocus: config.autoFocus,
      disableClose: config.disableClose,
      hasBackdrop: config.hasBackdrop,
      data: config.data,
      width: config?.width || "auto",
      height: config?.height || "auto",
      panelClass: [
        DialogCSSClasses.ResponsiveDialog,
        ...config.panelClass || []
      ],
    });

    return dialogRef;
  }
}
