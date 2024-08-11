import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddProductBody, GetCompaniesProductListBody, Product } from '../../types/product.type';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { CreateProductComponent } from '../../product/create-product/create-product.component';
import { DialogResult } from 'src/app/shared/types/dialog.type';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { Company } from '../../types/company.type';
import { ProductService } from '../../services/product.service';
import { AddInvoiceProductItem, Invoice, InvoiceProductItem } from '../../types/invoice.type';

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

  public get totalPrice(): number {
    return this.pricebeforeTax + this.taxPrice;
  }

  public get pricebeforeTax(): number {
    return (this.addInvoiceProductForm.get("price")?.value * this.addInvoiceProductForm.get("amount")?.value) - this.addInvoiceProductForm.get("discount")?.value
  }

  public get taxPrice(): number {
    return this.addInvoiceProductForm.get("taxPercent")?.value / 100 * this.pricebeforeTax;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddInvoiceProductComponent>,
    private productService: ProductService,
    private authentication: AuthenticationService,
    private dialog: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: { products: Product[], update: boolean, invoiceProductToUpdate?: InvoiceProductItem }
  ) {
    this.addInvoiceProductForm = this.fb.group({
      productCode: [null, Validators.required],
      productCodeSearch: [null],
      productName: [null, Validators.required],
      amount: [1, [Validators.min(1), Validators.required]],
      price: [null, Validators.required],
      discount: [null],
      taxPercent: [null, [Validators.min(0), Validators.max(100)]],
    });
  }

  ngOnInit(): void {
    this.filteredProducts = this.data.products;

    if (this.data.update && this.data.invoiceProductToUpdate) {
      this.addInvoiceProductForm.get("productCode")?.patchValue(this.data.invoiceProductToUpdate?.productCode);
      this.addInvoiceProductForm.get("productName")?.patchValue(this.data.invoiceProductToUpdate?.productName);
      this.addInvoiceProductForm.get("amount")?.patchValue(this.data.invoiceProductToUpdate?.amount);
      this.addInvoiceProductForm.get("discount")?.patchValue(this.data.invoiceProductToUpdate?.discount);
      this.addInvoiceProductForm.get("price")?.patchValue(this.data.invoiceProductToUpdate?.price);
      this.addInvoiceProductForm.get("taxPercent")?.patchValue(this.data.invoiceProductToUpdate?.taxPercent);
      this.addInvoiceProductForm.get("discount")?.setValidators(Validators.max(this.data.invoiceProductToUpdate?.price));
    }

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
