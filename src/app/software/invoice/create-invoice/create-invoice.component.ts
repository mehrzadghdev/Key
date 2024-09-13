import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FlightType, InvoicePatternType, InvoicePaymentMethod, InvoiceType } from '../../enums/invoice-type.enum';
import { SelectOption } from 'src/app/shared/types/common.type';
import { AddInvoiceBody, AddInvoiceProductItem, GetInvoiceListInvoiceItem, Invoice, InvoiceProductItem } from '../../types/definitions/invoice.type';
import { PersonService } from '../../services/definitions/person.service';
import { ProductService } from '../../services/definitions/product.service';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { Company } from '../../types/definitions/company.type';
import { GetCompaniesProductListBody, Product } from '../../types/definitions/product.type';
import { GetCompaniesPersonListBody, Person } from '../../types/definitions/person.type';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { CreatePersonComponent } from '../../person/create-person/create-person.component';
import { AddInvoiceProductComponent } from '../add-invoice-product/add-invoice-product.component';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { InvoiceService } from '../../services/definitions/invoice.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CurrencyService } from '../../services/definitions/currency.service';
import { Currency } from '../../types/definitions/currency.type';
import { SelectPatternTypeComponent } from '../select-pattern-type/select-pattern-type.component';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  public tailedTable: boolean = false;
  public invoiceForm: FormGroup;
  public disableInvoicePatternTypeChange: boolean = false;
  public validationLastCheck: boolean = false;
  public referenceInvoiceList: GetInvoiceListInvoiceItem[] = [];
  public filteredReferenceInvoiceList: GetInvoiceListInvoiceItem[] = [];
  public dataFetchLoaded: boolean = false;
  public productsList: Product[] = [];
  public personCodeAcDisplay: string = '';
  public personList: Person[] = [];
  public filteredPersonList: Person[] = [];
  public currencyList: Currency[] = [];
  public addInvoiceLoading: boolean = false;

  public invoiceProductsTableColumns: string[] = ['کد کالا', 'نام کالا', 'تعداد', 'قیمت', 'تخفیف', 'درصد مالیات', 'مالیات', 'عملیات']
  public invoiceProducts: AddInvoiceProductItem[] = [];

  public invoiceTypeList: SelectOption<InvoiceType>[] = [
    { display: "نوع اول", value: InvoiceType.TypeOne },
    { display: "نوع دوم", value: InvoiceType.TypeTwo },
  ]

  public invoicePaymentMethodList: SelectOption<InvoicePaymentMethod>[] = [
    { display: "نقدی", value: InvoicePaymentMethod.Cash },
    { display: "نسیه", value: InvoicePaymentMethod.Credit },
    { display: "نقد و نسیه", value: InvoicePaymentMethod.CashAndCredit }
  ]

  public invoicePatternTypeList: SelectOption<InvoicePatternType>[] = [
    { value: InvoicePatternType.Sale, display: "فروش" },
    { value: InvoicePatternType.CurrencySale, display: "فروش ارز" },
    { value: InvoicePatternType.GoldAndPlatinum, display: "طلا و جواهر و پلاتینیوم" },
    { value: InvoicePatternType.Contract, display: "قرارداد پیمان کاری" },
    { value: InvoicePatternType.UtilityBills, display: "قبوض خدماتی" },
    { value: InvoicePatternType.Export, display: "صادرات" },
    { value: InvoicePatternType.Ticket, display: "بلیط هواپیما" },
  ]
  public readonly partialInvoicePatternTypeList: SelectOption<InvoicePatternType>[] = [
    { value: InvoicePatternType.Sale, display: "فروش" },
    { value: InvoicePatternType.CurrencySale, display: "فروش ارز" },
    { value: InvoicePatternType.GoldAndPlatinum, display: "طلا و جواهر و پلاتینیوم" },
    { value: InvoicePatternType.Contract, display: "قرارداد پیمان کاری" },
    { value: InvoicePatternType.UtilityBills, display: "قبوض خدماتی" },
    { value: InvoicePatternType.Export, display: "صادرات" },
    { value: InvoicePatternType.Ticket, display: "بلیط هواپیما" },
  ]

  public flightTypeList: SelectOption<FlightType>[] = [
    { value: FlightType.Domestic, display: "پرواز های داخلی" },
    { value: FlightType.Foreign, display: "پرواز های خارجی" },
  ]

  get InvoiceTypeEnum(): typeof InvoiceType {
    return InvoiceType
  }
  get InvoicePatternTypeEnum(): typeof InvoicePatternType {
    return InvoicePatternType
  }

  constructor(
    private dialogRef: MatDialogRef<CreateInvoiceComponent>,
    private personService: PersonService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private currencyService: CurrencyService,
    private authentication: AuthenticationService,
    private utility: UtilityService,
    private dialog: DialogService,
    private fb: FormBuilder
  ) {
    this.invoiceForm = this.fb.group({
      invoiceCode: [null, [Validators.required, CustomValidators.code]],
      invoiceDate: [new Date().toISOString(), Validators.required],
      invoiceType: [InvoiceType.TypeOne, Validators.required],
      referenceInvoiceCode: [null, Validators.nullValidator],
      referenceInvoiceCodeSearch: [null],
      personCode: [null, Validators.required],
      personCodeSearch: [null],
      patternType: [null, Validators.required],
      vendorContractRegisterId: [null, Validators.nullValidator],
      exploitationId: [null, Validators.nullValidator],
      flightType: [null, Validators.nullValidator],
      cottageNumberOfCustoms: [null, Validators.nullValidator],
      cottageDateOfCustoms: [null, Validators.nullValidator],
      paymentMethod: [null, Validators.required],
      creditAmount: [null, Validators.nullValidator],
      payerNationalId: [null, CustomValidators.nationalId],
      payCardNumber: [null],
      payReferenceNumber: [null]
    })

    this.invoiceForm.get("referenceInvoiceCode")?.disable();
    this.invoiceForm.get("vendorContractRegisterId")?.disable();
    this.invoiceForm.get("creditAmount")?.disable();
  }

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.tailedTable = true;
    }

    this.initFormFieldSubscriptions();
    this.fetchData();
    this.openSelectInvoicePatternDialog();

    this.invoiceService.getNewInvoiceCode({}).subscribe(res => {
      this.invoiceForm.get('invoiceCode')?.patchValue(res.newCode);
    })
  }

  private openSelectInvoicePatternDialog(): void {
    this.dialog.openFormDialog(SelectPatternTypeComponent,  {
      width: "656px"
    }).afterClosed().subscribe(result => {
      this.invoiceForm.get("patternType")?.patchValue(result as unknown as InvoicePatternType)
    })
  }

  private fetchData(): void {
    this.dataFetchLoaded = false;

    const dataFetchBody: GetCompaniesPersonListBody | GetCompaniesProductListBody = {
      page: 1,
      pageSize: 10000
    };

    forkJoin({
      persons: this.personService.getCompaniesPersonList(dataFetchBody),
      products: this.productService.getCompaniesProductList(dataFetchBody),
      invoices: this.invoiceService.getCompaniesInvoiceList(dataFetchBody),
      currencies: this.currencyService.getCurrencyList(dataFetchBody)
    })
      .subscribe(res => {
        this.productsList = res.products.result;

        this.personList = res.persons.result;
        this.filteredPersonList = res.persons.result;

        this.currencyList = res.currencies.result;

        this.referenceInvoiceList = res.invoices.saleInvoices;
        this.filteredReferenceInvoiceList = res.invoices.saleInvoices;

        this.dataFetchLoaded = true;
      })
  }

  private initFormFieldSubscriptions(): void {
    this.invoiceForm.get("invoiceType")?.valueChanges.subscribe(value => {
      if (value === InvoiceType.TypeTwo) {
        this.invoiceForm.get("personCode")?.clearValidators();
        this.invoiceForm.get("personCode")?.updateValueAndValidity();

        this.invoiceForm.get("paymentMethod")?.patchValue(InvoicePaymentMethod.Cash);
        this.invoiceForm.get("paymentMethod")?.disable();

        this.invoiceForm.get("patternType")?.patchValue(null);
        this.invoicePatternTypeList = this.invoicePatternTypeList.filter(pattern => pattern.value === InvoicePatternType.GoldAndPlatinum || pattern.value === InvoicePatternType.Sale);
      }
      else {
        this.invoicePatternTypeList = this.partialInvoicePatternTypeList;

        if (this.invoiceForm.get("patternType")?.value !== InvoicePatternType.Export) {
          this.invoiceForm.get("personCode")?.setValidators(Validators.required);
          this.invoiceForm.get("personCode")?.updateValueAndValidity();
          this.invoiceForm.get("paymentMethod")?.patchValue(null);
          this.invoiceForm.get("paymentMethod")?.enable();
        }
      }
    })

    this.invoiceForm.get("patternType")?.valueChanges.subscribe(value => {
      if (
        value === InvoicePatternType.CurrencySale
        || value === InvoicePatternType.Ticket
        || value === InvoicePatternType.Contract
        || value === InvoicePatternType.UtilityBills
      ) {
        this.invoiceForm.get("invoiceType")?.patchValue(InvoiceType.TypeOne);
        this.invoiceForm.get("invoiceType")?.disable({ emitEvent: false, });
      }
      else {
        this.invoiceForm.get("invoiceType")?.enable({ emitEvent: false, });
      }

      // if (
      //   value !== InvoicePatternType.CurrencySale
      //   && value !== InvoicePatternType.Ticket
      //   && value !== InvoicePatternType.Contract
      //   && value !== InvoicePatternType.UtilityBills
      // ) {
      //   this.invoiceForm.get("invoiceType")?.enable();
      // }

      if (value === InvoicePatternType.Contract) {
        this.invoiceForm.get("vendorContractRegisterId")?.setValidators(Validators.required);
        this.invoiceForm.get("vendorContractRegisterId")?.updateValueAndValidity();
        this.invoiceForm.get("vendorContractRegisterId")?.enable();
      }
      else {
        this.invoiceForm.get("vendorContractRegisterId")?.clearValidators();
        this.invoiceForm.get("vendorContractRegisterId")?.updateValueAndValidity();
        this.invoiceForm.get("vendorContractRegisterId")?.patchValue(null);
        this.invoiceForm.get("vendorContractRegisterId")?.disable();
      }

      if (value === InvoicePatternType.UtilityBills) {
        this.invoiceForm.get("exploitationId")?.setValidators(Validators.required);
        this.invoiceForm.get("exploitationId")?.updateValueAndValidity();
        this.invoiceForm.get("exploitationId")?.enable();
      }
      else {
        this.invoiceForm.get("exploitationId")?.clearValidators();
        this.invoiceForm.get("exploitationId")?.updateValueAndValidity();
        this.invoiceForm.get("exploitationId")?.patchValue(null);
        this.invoiceForm.get("exploitationId")?.disable();
      }

      if (value === InvoicePatternType.Ticket) {
        this.invoiceForm.get("flightType")?.setValidators(Validators.required);
        this.invoiceForm.get("flightType")?.updateValueAndValidity();
        this.invoiceForm.get("flightType")?.enable();
      }
      else {
        this.invoiceForm.get("flightType")?.clearValidators();
        this.invoiceForm.get("flightType")?.updateValueAndValidity();
        this.invoiceForm.get("flightType")?.patchValue(null);
        this.invoiceForm.get("flightType")?.disable();
      }

      if (value === InvoicePatternType.Export) {
        this.invoiceForm.get("personCode")?.clearValidators();
        this.invoiceForm.get("personCode")?.updateValueAndValidity();
        this.invoiceForm.get("paymentMethod")?.patchValue(InvoicePaymentMethod.Cash);
        this.invoiceForm.get("paymentMethod")?.disable();
      }
      else {
        if (this.invoiceForm.get("invoiceType")?.value !== InvoiceType.TypeTwo) {
          this.invoiceForm.get("personCode")?.setValidators(Validators.required);
          this.invoiceForm.get("personCode")?.updateValueAndValidity();
          this.invoiceForm.get("paymentMethod")?.patchValue(null);
          this.invoiceForm.get("paymentMethod")?.enable();
        }
      }
    })

    this.invoiceForm.get("paymentMethod")?.valueChanges.subscribe(value => {
      if (value === InvoicePaymentMethod.CashAndCredit) {
        this.invoiceForm.get("creditAmount")?.setValidators([Validators.required, Validators.min(1)]);
        this.invoiceForm.get("creditAmount")?.updateValueAndValidity();
        this.invoiceForm.get("creditAmount")?.enable();
      }
      else {
        this.invoiceForm.get("creditAmount")?.clearValidators();
        this.invoiceForm.get("creditAmount")?.updateValueAndValidity();
        this.invoiceForm.get("creditAmount")?.patchValue(null);
        this.invoiceForm.get("creditAmount")?.disable();
      }
      
      if (value === InvoicePaymentMethod.Credit) {
        this.invoiceForm.get("payerNationalId")?.disable();
        this.invoiceForm.get("payCardNumber")?.disable();
        this.invoiceForm.get("payReferenceNumber")?.disable();
      }
      else {
        this.invoiceForm.get("payerNationalId")?.enable();
        this.invoiceForm.get("payCardNumber")?.enable();
        this.invoiceForm.get("payReferenceNumber")?.enable();
      }
    })

    this.invoiceForm.get("personCodeSearch")?.valueChanges.subscribe(value => {
      this.filteredPersonList = this.personList.filter(person => person.personName.includes(value));
    })

    this.invoiceForm.get("referenceInvoiceCodeSearch")?.valueChanges.subscribe(value => {
      this.filteredReferenceInvoiceList = this.referenceInvoiceList.filter(invoice => invoice.personName.includes(value));
    })
  }

  public onAddInvoice(): void {
    if (!this.invoiceForm.invalid && this.invoiceProducts.length > 0) {
      this.addInvoiceLoading = true;

      const addInvoiceBody: AddInvoiceBody = {
        invoiceCode: this.invoiceForm.get('invoiceCode')?.value ?? 0,
        invoiceDate: this.invoiceForm.get('invoiceDate')?.value ?? new Date().toISOString(),
        invoiceTime: '',
        invoiceType: this.invoiceForm.get('invoiceType')?.value,
        referenceInvoiceCode: this.invoiceForm.get('referenceInvoiceCode')?.value ?? null,
        personCode: this.invoiceForm.get('personCode')?.value,
        patternType: this.invoiceForm.get('patternType')?.value,
        vendorContractRegisterId: this.invoiceForm.get('vendorContractRegisterId')?.value ?? "" + "",
        paymentMethod: this.invoiceForm.get('paymentMethod')?.value,
        creditAmount: this.invoiceForm.get('creditAmount')?.value ?? 0,
        payerNationalId: this.invoiceForm.get('payerNationalId')?.value ?? "" + "",
        payCardNumber: this.invoiceForm.get('payCardNumber')?.value ?? "" + "",
        payReferenceNumber: this.invoiceForm.get('payReferenceNumber')?.value ?? "" + "",
        saleInvoiceItems: this.invoiceProducts
      }

      this.invoiceService.addInvoice(addInvoiceBody).subscribe(
        res => {
        this.addInvoiceLoading = false;
        this.utility.message("فاکتور فروش با موفقیت ایجاد شد.", 'بستن');
        this.closeDialog(addInvoiceBody.invoiceCode);
        },
        err => {
          this.addInvoiceLoading = false
        }
      )
    }
    else {
      this.invoiceForm.markAllAsTouched();
      this.validationLastCheck = true;
    }
  }

  public onAddPerson(): void {
    this.dialog.openFormDialog(CreatePersonComponent, {
      width: "456px"
    }).afterClosed().subscribe(createdPerson => {
      const typedCreatedPerson: Person = createdPerson as unknown as Person;

      if (typedCreatedPerson) {
        this.invoiceForm.get('personCode')?.patchValue(typedCreatedPerson.code);
      }

      this.fetchData();
    })
  }

  public onAddInvoiceProduct(): void {
    this.dialog.openFormDialog(AddInvoiceProductComponent, {
      width: "456px",
      data: {
        products: this.productsList,
        currencies: this.currencyList,
        pattern: this.invoiceForm.get('patternType')?.value,
      }
    }).afterClosed().subscribe(invoiceProductItem => {
      if (invoiceProductItem) {
        this.invoiceProducts.push(invoiceProductItem as unknown as AddInvoiceProductItem);
        this.invoiceProducts = [...this.invoiceProducts];
        this.invoiceForm.get("patternType")?.disable();
      }
    })
  }

  public onDeleteInvoiceProduct(invoiceProductCode: number): void {
    this.dialog.openAcceptDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.invoiceProducts = this.invoiceProducts.filter(product => product.productCode !== invoiceProductCode);
        if (this.invoiceProducts.length < 1) {
          this.invoiceForm.get("patternType")?.enable();
        }
        this.utility.message('کالا با موفقیت حذف شد.', 'بستن');
      }
    })
  }

  public onUpdateInvoiceProduct(invoiceProductItemToUpdate: InvoiceProductItem): void {
    this.dialog.openFormDialog(AddInvoiceProductComponent, {
      width: "456px",
      data: {
        products: this.productsList,
        currencies: this.currencyList,
        pattern: this.invoiceForm.get('patternType')?.value,
        update: true,
        invoiceProductToUpdate: invoiceProductItemToUpdate
      }
    }).afterClosed().subscribe(invoiceProductItem => {
      if (invoiceProductItem) {
        this.invoiceProducts = this.invoiceProducts.filter(product => product.productCode !== (invoiceProductItem as unknown as AddInvoiceProductItem).productCode);
        this.invoiceProducts.push(invoiceProductItem as unknown as AddInvoiceProductItem);
        this.invoiceProducts = [...this.invoiceProducts];
      }
    })
  }

  public closeDialog(value?: any): void {
    this.dialogRef.close(value);
  }
}
