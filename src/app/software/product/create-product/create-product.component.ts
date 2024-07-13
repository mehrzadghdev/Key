import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductType } from '../../enums/product-type.enum';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AddProductBody } from '../../types/product.type';
import { ProductService } from '../../services/product.service';
import { Company } from '../../types/company.type';
import { UnitService } from '../../services/unit.service';
import { Unit } from '../../types/unit.type';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  public addProductForm: FormGroup;
  public validationLastCheck: boolean = false;
  public addProductLoading: boolean = false;
  public getUnitListLoading: boolean = true;
  public unitList: Unit[] = [];
  public productTypes = [
    { display: 'کالا', value: ProductType.Product },
    { display: 'خدمات', value: ProductType.Service },
  ]
  
  constructor(
    private dialgoRef: MatDialogRef<CreateProductComponent>, 
    private productService: ProductService, private fb: FormBuilder, 
    private authentication: AuthenticationService,
    private unitSerivce: UnitService,
    private utility: UtilityService
  ) {
    this.addProductForm = fb.group({
      code: [null, Validators.required],
      productCode: ["", Validators.required],
      productType: [0, Validators.required],
      name: ["", Validators.required],
      price: [null, Validators.required],
      taxPercent: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
      unitCode: [null, Validators.required],
      otherLegalFunds: [''],
      otherLegalFundsPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      otherTax: [""],
      otherTaxPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    })
  }

  ngOnInit(): void {
    this.unitSerivce.getUnitList().subscribe(res => {
      this.getUnitListLoading = false;
      this.unitList = res;
    })
  }

  public onAddProduct(): void {
    if (this.addProductForm.valid) {
      this.addProductLoading = true;
      const currentCompany = this.authentication.currentCompany as Company;
      const addProductBody: AddProductBody = {
        databaseId: currentCompany.databaseId,
        code: this.addProductForm.controls["code"].value,
        productType: this.addProductForm.controls["productType"].value,
        productCode: this.addProductForm.controls["productCode"].value,
        name: this.addProductForm.controls["name"].value,
        price: this.addProductForm.controls["price"].value,
        taxPercent: this.addProductForm.controls["taxPercent"].value,
        unitCode: this.addProductForm.controls["unitCode"].value,
        otherLegalFunds: this.addProductForm.controls["otherLegalFunds"].value,
        otherLegalFundsPercent: this.addProductForm.controls["otherLegalFundsPercent"].value,
        otherTax: this.addProductForm.controls["otherTax"].value,
        otherTaxPercent: this.addProductForm.controls["otherTaxPercent"].value
      }

      this.productService.addProduct(addProductBody).subscribe(res => {
        this.addProductLoading = false;
        this.utility.message((this.addProductForm.controls["productType"].value === ProductType.Product ? 'کالا' : 'خدمات') + ' با موفقیت ایجاد شد.', 'بستن');
        this.closeDialog(addProductBody.code);
      },
      err => {
        this.addProductLoading = false
      })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public closeDialog(value?: any): void {
    this.dialgoRef.close(value);
  }
}
