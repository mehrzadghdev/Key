import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  public message(content: string | ComponentType<any>, action: string, type: 'dynamic' | 'static' = 'static',) {
    if (type === 'static' && typeof content === 'string') {
      return this.snackBar.open(content, action);
    }

    if (type === 'dynamic' && typeof content !== 'string') {
      return this.snackBar.openFromComponent(content);
    }

    return console.error("Message utiltiy called with bad params");
  }
}
