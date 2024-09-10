import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddProductBody, GetCompaniesProductListBody, Product } from '../../types/definitions/product.type';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { CreateProductComponent } from '../../product/create-product/create-product.component';
import { DialogResult } from 'src/app/shared/types/dialog.type';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { Company } from '../../types/definitions/company.type';
import { ProductService } from '../../services/definitions/product.service';
import { AddInvoiceProductItem, Invoice, InvoiceProductItem } from '../../types/definitions/invoice.type';
import { Currency } from '../../types/definitions/currency.type';
import { InvoicePatternType } from '../../enums/invoice-type.enum';

@Component({
  selector: 'app-add-invoice-product',
  templateUrl: './add-invoice-product.component.html',
  styleUrls: ['./add-invoice-product.component.scss']
})
export class AddInvoiceProductComponent implements OnInit {
  public addInvoiceProductForm: FormGroup;
  public productListLoaded: boolean = true;
  public validationLastCheck: boolean = false;
  public filteredProducts: Product[] = []

  public currencyList: Currency[] = [];
  public filteredCurrencyList: Currency[] = [];

  public get totalPrice(): number {
    return this.pricebeforeTax + this.taxPrice;
  }

  public get pricebeforeTax(): number {
    return (this.addInvoiceProductForm.get("price")?.value * this.addInvoiceProductForm.get("amount")?.value) - this.addInvoiceProductForm.get("discount")?.value
  }

  public get taxPrice(): number {
    return this.addInvoiceProductForm.get("taxPercent")?.value / 100 * this.pricebeforeTax;
  }

  get InvoicePatternTypeEnum(): typeof InvoicePatternType {
    return InvoicePatternType
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddInvoiceProductComponent>,
    private productService: ProductService,
    private authentication: AuthenticationService,
    private dialog: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: { products: Product[], currencies: Currency[], pattern: InvoicePatternType, update: boolean, invoiceProductToUpdate?: InvoiceProductItem }
  ) {
    this.addInvoiceProductForm = this.fb.group({
      productCode: [null, Validators.required],
      productCodeSearch: [null],
      productName: [null, Validators.required],
      amount: [1, [Validators.min(1), Validators.required]],
      price: [null, Validators.required],
      discount: [null],
      taxPercent: [null, [Validators.min(0), Validators.max(100)]],
      currencyAmount: [null, Validators.nullValidator],
      currencyType: [null, Validators.nullValidator],
      currencyTypeSearch: [null, Validators.nullValidator],
      exchangeRateRials: [null, Validators.nullValidator],
      productRialsWorth: [null, Validators.nullValidator],
      productCurrencyWorth: [null, Validators.nullValidator],
      constructionWages: [null, Validators.nullValidator],
      uniqueWorkRightIdentifier: [null, Validators.nullValidator],
      sellersProfit: [null, Validators.nullValidator],
      rightToWork: [null, Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    this.filteredProducts = this.data.products;
    this.currencyList = this.data.currencies;
    this.filteredCurrencyList = this.data.currencies;

    if (this.data.update && this.data.invoiceProductToUpdate) {
      this.addInvoiceProductForm.get("productCode")?.patchValue(this.data.invoiceProductToUpdate?.productCode);
      this.addInvoiceProductForm.get("productName")?.patchValue(this.data.invoiceProductToUpdate?.productName);
      this.addInvoiceProductForm.get("amount")?.patchValue(this.data.invoiceProductToUpdate?.amount);
      this.addInvoiceProductForm.get("discount")?.patchValue(this.data.invoiceProductToUpdate?.discount);
      this.addInvoiceProductForm.get("price")?.patchValue(this.data.invoiceProductToUpdate?.price);
      this.addInvoiceProductForm.get("taxPercent")?.patchValue(this.data.invoiceProductToUpdate?.taxPercent);
      this.addInvoiceProductForm.get("discount")?.setValidators(Validators.max(this.data.invoiceProductToUpdate?.price));
    }

    this.initPatternTypeFromConditions();
    this.initFromSubscriptions();
  }

  private initPatternTypeFromConditions(): void {
    if (this.data.pattern === InvoicePatternType.CurrencySale) {
      this.addInvoiceProductForm.get("currencyAmount")?.setValidators(Validators.required);
      this.addInvoiceProductForm.get("currencyAmount")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("currencyAmount")?.enable();
      this.addInvoiceProductForm.get("currencyAmount")?.patchValue(0);
      this.addInvoiceProductForm.get("currencyType")?.setValidators(Validators.required);
      this.addInvoiceProductForm.get("currencyType")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("currencyType")?.enable();
      this.addInvoiceProductForm.get("exchangeRateRials")?.setValidators(Validators.required);
      this.addInvoiceProductForm.get("exchangeRateRials")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("exchangeRateRials")?.enable();
      this.addInvoiceProductForm.get("exchangeRateRials")?.patchValue(0);
      this.addInvoiceProductForm.get("productRialsWorth")?.setValidators(Validators.required);
      this.addInvoiceProductForm.get("productRialsWorth")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("productRialsWorth")?.enable();
      this.addInvoiceProductForm.get("productRialsWorth")?.patchValue(0);
      this.addInvoiceProductForm.get("productCurrencyWorth")?.setValidators(Validators.required);
      this.addInvoiceProductForm.get("productCurrencyWorth")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("productCurrencyWorth")?.enable();
      this.addInvoiceProductForm.get("productCurrencyWorth")?.patchValue(0);
    }
    else {
      this.addInvoiceProductForm.get("currencyAmount")?.clearValidators();
      this.addInvoiceProductForm.get("currencyAmount")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("currencyAmount")?.patchValue(null);
      this.addInvoiceProductForm.get("currencyAmount")?.disable();
      this.addInvoiceProductForm.get("currencyType")?.clearValidators();
      this.addInvoiceProductForm.get("currencyType")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("currencyType")?.patchValue(null);
      this.addInvoiceProductForm.get("currencyType")?.disable();
      this.addInvoiceProductForm.get("exchangeRateRials")?.clearValidators();
      this.addInvoiceProductForm.get("exchangeRateRials")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("exchangeRateRials")?.patchValue(null);
      this.addInvoiceProductForm.get("exchangeRateRials")?.disable();
      this.addInvoiceProductForm.get("productRialsWorth")?.clearValidators();
      this.addInvoiceProductForm.get("productRialsWorth")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("productRialsWorth")?.patchValue(null);
      this.addInvoiceProductForm.get("productRialsWorth")?.disable();
      this.addInvoiceProductForm.get("productCurrencyWorth")?.clearValidators();
      this.addInvoiceProductForm.get("productCurrencyWorth")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("productCurrencyWorth")?.patchValue(null);
      this.addInvoiceProductForm.get("productCurrencyWorth")?.disable();
    }

    if (this.data.pattern === InvoicePatternType.GoldAndPlatinum) {
      this.addInvoiceProductForm.get("constructionWages")?.setValidators(Validators.required);
      this.addInvoiceProductForm.get("constructionWages")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("constructionWages")?.enable();
      this.addInvoiceProductForm.get("constructionWages")?.patchValue(0);
      this.addInvoiceProductForm.get("sellersProfit")?.setValidators(Validators.required);
      this.addInvoiceProductForm.get("sellersProfit")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("sellersProfit")?.enable();
      this.addInvoiceProductForm.get("sellersProfit")?.patchValue(0);
      this.addInvoiceProductForm.get("rightToWork")?.setValidators(Validators.required);
      this.addInvoiceProductForm.get("rightToWork")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("rightToWork")?.enable();
      this.addInvoiceProductForm.get("rightToWork")?.patchValue(0);
      this.addInvoiceProductForm.get("uniqueWorkRightIdentifier")?.setValidators(Validators.required);
      this.addInvoiceProductForm.get("uniqueWorkRightIdentifier")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("uniqueWorkRightIdentifier")?.enable();
    }
    else {
      this.addInvoiceProductForm.get("constructionWages")?.clearValidators();
      this.addInvoiceProductForm.get("constructionWages")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("constructionWages")?.patchValue(null);
      this.addInvoiceProductForm.get("constructionWages")?.disable();
      this.addInvoiceProductForm.get("sellersProfit")?.clearValidators();
      this.addInvoiceProductForm.get("sellersProfit")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("sellersProfit")?.patchValue(null);
      this.addInvoiceProductForm.get("sellersProfit")?.disable();
      this.addInvoiceProductForm.get("rightToWork")?.clearValidators();
      this.addInvoiceProductForm.get("rightToWork")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("rightToWork")?.patchValue(null);
      this.addInvoiceProductForm.get("rightToWork")?.disable();
      this.addInvoiceProductForm.get("uniqueWorkRightIdentifier")?.clearValidators();
      this.addInvoiceProductForm.get("uniqueWorkRightIdentifier")?.updateValueAndValidity();
      this.addInvoiceProductForm.get("uniqueWorkRightIdentifier")?.patchValue(null);
      this.addInvoiceProductForm.get("uniqueWorkRightIdentifier")?.disable();
    }

    if (this.data.pattern === InvoicePatternType.Ticket) {
      this.addInvoiceProductForm.get("amount")?.patchValue(1);
      this.addInvoiceProductForm.get("amount")?.disable();
    }
  }
  
  private initFromSubscriptions(): void {    
    this.addInvoiceProductForm.get("currencyTypeSearch")?.valueChanges.subscribe(value => {
      this.filteredCurrencyList = this.currencyList.filter(currency => currency.currencyName.includes(value));
    })
  
    this.addInvoiceProductForm.get("productCodeSearch")?.valueChanges.subscribe(value => {
      this.filteredProducts = this.data.products.filter(product => product.name.includes(value));
    })
  
    this.addInvoiceProductForm.get("price")?.valueChanges.subscribe(value => {
      this.addInvoiceProductForm.get("discount")?.setValidators(Validators.max(value));
    })
  }

  public closeDialog(value?: AddInvoiceProductItem): void {
    this.dialogRef.close(value);
  }

  public onAddInvoiceProduct(): void {
    if (this.addInvoiceProductForm.valid) {
      const currentCompany = this.authentication.currentCompany as Company;

      const invoiceProductItem: AddInvoiceProductItem = {
        databaseId: currentCompany.databaseId,
        productCode: this.addInvoiceProductForm.get("productCode")?.value,
        productName: this.addInvoiceProductForm.get("productName")?.value,
        amount: this.addInvoiceProductForm.get("amount")?.value ?? 1,
        price: this.addInvoiceProductForm.get("price")?.value ?? 0,
        discount: this.addInvoiceProductForm.get("discount")?.value ?? 0,
        taxPercent: this.addInvoiceProductForm.get("taxPercent")?.value ?? 0,
        tax: this.taxPrice,
      }

      this.closeDialog(invoiceProductItem);
    }
    else {
      this.addInvoiceProductForm.markAllAsTouched();
      this.validationLastCheck = true;
    }
  }

  public loadProductList(productCodeToAutoFill: number): void {
    this.productListLoaded = false;

    const productListBody: GetCompaniesProductListBody = {
      page: 1,
      pageSize: 10000
    };

    this.productService.getCompaniesProductList(productListBody).subscribe(res => {
      this.filteredProducts = res.result;
      this.data.products = res.result;

      this.onAutoFillData(productCodeToAutoFill);
      this.productListLoaded = true;
    })
  }

  public onAddProduct(): void {
    this.dialog.openFormDialog(CreateProductComponent, {
      width: "456px"
    }).afterClosed().subscribe((productCode) => {
      if (productCode) {
        this.addInvoiceProductForm.get('productCode')?.patchValue(productCode);
        this.loadProductList(productCode as unknown as number);
      }
    })
  }

  public onAutoFillData(productCode: number): void {
    const currentProduct: Product = this.data.products.find(product => product.code === productCode) as Product;

    this.addInvoiceProductForm.get("productName")?.patchValue(currentProduct.name);
    this.addInvoiceProductForm.get("price")?.patchValue(currentProduct.price);
    this.addInvoiceProductForm.get("taxPercent")?.patchValue(currentProduct.taxPercent);
  }
}
