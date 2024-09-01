import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IsType } from 'src/app/shared/helpers/isType.helper';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { SelectOption } from 'src/app/shared/types/common.type';

@Component({
  selector: 'app-user-event-more-details',
  templateUrl: './user-event-more-details.component.html',
  styleUrls: ['./user-event-more-details.component.scss']
})
export class UserEventMoreDetailsComponent implements OnInit {
  public dataFields: SelectOption<string>[] = [];

  constructor(
    private dialogRef: MatDialogRef<UserEventMoreDetailsComponent>,
    private clipboard: Clipboard,
    private utility: UtilityService,
    @Inject(MAT_DIALOG_DATA) public data: { moreDetailsJson: string, softwarePartName: string }
  ) { }

  ngOnInit(): void {
    const parsedData: any = JSON.parse(this.data.moreDetailsJson)
  
    for (const key in parsedData) {
      const fieldValue = parsedData[key];

      this.dataFields.push({
        display: key, value: !IsType.void(fieldValue) ? fieldValue : '-'
      })
    }
  }

  public closeDialog(value?: any): void {
    this.dialogRef.close(value);
  }

  public isDateISO(value: string): boolean {
    return IsType.dateISO(value);
  }

  public copyObjectJSON(): void {
    this.clipboard.copy(this.data.moreDetailsJson);
    this.utility.message(`اطلاعات ${this.data.softwarePartName} با موفقیت کپی شد`, 'بستن')
  }
}
