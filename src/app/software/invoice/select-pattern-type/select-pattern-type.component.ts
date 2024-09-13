import { Component } from '@angular/core';
import { SelectOption } from 'src/app/shared/types/common.type';
import { InvoicePatternType } from '../../enums/invoice-type.enum';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-pattern-type',
  templateUrl: './select-pattern-type.component.html',
  styleUrls: ['./select-pattern-type.component.scss']
})
export class SelectPatternTypeComponent {
  public readonly invoicePatternTypeList = [
    { value: InvoicePatternType.Sale, imageSource: "assets/images/software/pattern-sale.svg", display: "فروش" },
    { value: InvoicePatternType.CurrencySale, imageSource: "assets/images/software/pattern-currency-sale.svg", display: "فروش ارز" },
    { value: InvoicePatternType.GoldAndPlatinum, imageSource: "assets/images/software/pattern-gold.svg", display: "طلا و جواهر و پلاتینیوم" },
    { value: InvoicePatternType.Contract, imageSource: "assets/images/software/pattern-contract.svg", display: "قرارداد پیمان کاری" },
    { value: InvoicePatternType.UtilityBills, imageSource: "assets/images/software/pattern-bills.svg", display: "قبوض خدماتی" },
    { value: InvoicePatternType.Export, imageSource: "assets/images/software/pattern-export.svg", display: "صادرات" },
    { value: InvoicePatternType.Ticket, imageSource: "assets/images/software/pattern-ticket.svg", display: "بلیط هواپیما" },
  ]

  constructor(private dialogRef: MatDialogRef<SelectPatternTypeComponent>) { }

  public selectInvoicePattern(invoicePattern: InvoicePatternType): void {
    this.dialogRef.close(invoicePattern);
  }
}
