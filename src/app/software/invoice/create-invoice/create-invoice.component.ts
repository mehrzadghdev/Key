import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { InvoicePatternType, InvoicePaymentMethod, InvoiceType } from '../../enums/invoice-type.enum';
import { SelectOption } from 'src/app/shared/types/common.type';
import { AddInvoiceBody, GetInvoiceListInvoiceItem, Invoice, InvoiceProductItem } from '../../types/invoice.type';
import { PersonService } from '../../services/person.service';
import { ProductService } from '../../services/product.service';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Company } from '../../types/company.type';
import { GetCompaniesProductListBody, Product } from '../../types/product.type';
import { GetCompaniesPersonListBody, Person } from '../../types/person.type';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { CreatePersonComponent } from '../../person/create-person/create-person.component';
import { AddInvoiceProductComponent } from '../add-invoice-product/add-invoice-product.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { InvoiceService } from '../../services/invoice.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  public invoiceForm: FormGroup;
  public validationLastCheck: boolean = false;
  public referenceInvoiceList: GetInvoiceListInvoiceItem[] = [];
  public filteredReferenceInvoiceList: GetInvoiceListInvoiceItem[] = [];
  public dataFetchLoaded: boolean = false;
  public productsList: Product[] = [];
  public personCodeAcDisplay: string = '';
  public personList: Person[] = [];
  public filteredPersonList: Person[] = [];
  public addInvoiceLoading: boolean = false;

  public invoiceProductsTableColumns: string[] = ['کد کالا', 'نام کالا', 'تعداد', 'قیمت', 'تخفیف', 'درصد مالیات', 'مالیات', 'عملیات']
  public invoiceProducts: InvoiceProductItem[] = [];

  public invoiceTypeList: SelectOption<InvoiceType>[] = [
    { display: "اصلی", value: InvoiceType.Main },
    { display: "ابطالی", value: InvoiceType.Cancellation },
    { display: "اصلاحی", value: InvoiceType.Corrective }
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
  ]

  get InvoiceTypeEnum(): typeof InvoiceType {
    return InvoiceType
  }

  constructor(
    private dialogRef: MatDialogRef<CreateInvoiceComponent>,
    private personService: PersonService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private authentication: AuthenticationService,
    private utility: UtilityService,
    private dialog: DialogService,
    private fb: FormBuilder
  ) {
    this.invoiceForm = this.fb.group({
      invoiceCode: [null, [Validators.required, CustomValidators.code]],
      invoiceDate: [new Date().toISOString(), Validators.required],
      invoiceType: [0, Validators.required],
      referenceInvoiceCode: [null, Validators.nullValidator],
      referenceInvoiceCodeSearch: [null],
      personCode: [null, Validators.required],
      personCodeSearch: [null],
      patternType: [null, Validators.required],
      vendorContractRegisterId: [null, Validators.nullValidator],
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
    this.initFormFieldSubscriptions();
    this.fetchData();

    this.invoiceService.getNewInvoiceCode({}).subscribe(res => {
      this.invoiceForm.get('invoiceCode')?.patchValue(res.newCode);
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
      invoices: this.invoiceService.getCompaniesInvoiceList(dataFetchBody)
    })
      .subscribe(res => {
        this.productsList = res.products.result;

        this.personList = res.persons.result;
        this.filteredPersonList = res.persons.result;

        this.referenceInvoiceList = res.invoices.saleInvoices;
        this.filteredReferenceInvoiceList = res.invoices.saleInvoices;

        this.dataFetchLoaded = true;
      })
  }

  private initFormFieldSubscriptions(): void {
    this.invoiceForm.get("invoiceType")?.valueChanges.subscribe(value => {
      if (value === InvoiceType.Corrective) {
        this.invoiceForm.get("referenceInvoiceCode")?.setValidators(Validators.required);
        this.invoiceForm.get("referenceInvoiceCode")?.updateValueAndValidity();
        this.invoiceForm.get("referenceInvoiceCode")?.enable();
      }
      else {
        this.invoiceForm.get("referenceInvoiceCode")?.clearValidators();
        this.invoiceForm.get("referenceInvoiceCode")?.updateValueAndValidity();
        this.invoiceForm.get("referenceInvoiceCode")?.patchValue(null);
        this.invoiceForm.get("referenceInvoiceCode")?.disable();
      }
    })

    this.invoiceForm.get("patternType")?.valueChanges.subscribe(value => {
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
    })

    this.invoiceForm.get("paymentMethod")?.valueChanges.subscribe(value => {
      if (value !== InvoicePaymentMethod.Cash) {
        this.invoiceForm.get("creditAmount")?.setValidators(Validators.required);
        this.invoiceForm.get("creditAmount")?.updateValueAndValidity();
        this.invoiceForm.get("creditAmount")?.enable();
      }
      else {
        this.invoiceForm.get("creditAmount")?.clearValidators();
        this.invoiceForm.get("creditAmount")?.updateValueAndValidity();
        this.invoiceForm.get("creditAmount")?.patchValue(null);
        this.invoiceForm.get("creditAmount")?.disable();
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
    if (!this.invoiceForm.invalid) {

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

      this.invoiceService.addInvoice(addInvoiceBody).subscribe(res => {
        this.addInvoiceLoading = false;
        this.utility.message("فاکتور فروش با موفقیت ایجاد شد.", 'بستن');
        this.closeDialog(addInvoiceBody.invoiceCode);
      },
        err => {
          this.addInvoiceLoading = false
        })
    }
    else {
      this.invoiceForm.markAllAsTouched();
      console.log(this.invoiceForm);
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
        products: this.productsList
      }
    }).afterClosed().subscribe(invoiceProductItem => {
      if (invoiceProductItem) {
        this.invoiceProducts.push(invoiceProductItem as unknown as InvoiceProductItem);
        this.invoiceProducts = [...this.invoiceProducts];
      }
    })
  }

  public onDeleteInvoiceProduct(invoiceProductCode: number): void {
    this.dialog.openAcceptDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.invoiceProducts = this.invoiceProducts.filter(product => product.productCode !== invoiceProductCode);
        this.utility.message('کالا با موفقیت حذف شد.', 'بستن');
      }
    })
  }

  public onUpdateInvoiceProduct(invoiceProductItemToUpdate: InvoiceProductItem): void {
    this.dialog.openFormDialog(AddInvoiceProductComponent, {
      width: "456px",
      data: {
        products: this.productsList,
        update: true,
        invoiceProductToUpdate: invoiceProductItemToUpdate
      }
    }).afterClosed().subscribe(invoiceProductItem => {
      if (invoiceProductItem) {
        this.invoiceProducts = this.invoiceProducts.filter(product => product.productCode !== (invoiceProductItem as unknown as InvoiceProductItem).productCode);
        this.invoiceProducts.push(invoiceProductItem as unknown as InvoiceProductItem);
        this.invoiceProducts = [...this.invoiceProducts];
      }
    })
  }

  public closeDialog(value?: any): void {
    this.dialogRef.close(value);
  }
}
