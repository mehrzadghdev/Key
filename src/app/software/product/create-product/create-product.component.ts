import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductType } from '../../enums/product-type.enum';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { AddProductBody } from '../../types/definitions/product.type';
import { ProductService } from '../../services/definitions/product.service';
import { Company } from '../../types/definitions/company.type';
import { UnitService } from '../../services/definitions/unit.service';
import { Unit } from '../../types/definitions/unit.type';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { ProductIdSearchComponent } from '../product-id-search/product-id-search.component';

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
  public filteredUnitList: Unit[] = [];
  public productTypes = [
    { display: 'کالا', value: ProductType.Product },
    { display: 'خدمات', value: ProductType.Service },
  ]
  
  constructor(
    private dialgoRef: MatDialogRef<CreateProductComponent>, 
    private productService: ProductService, private fb: FormBuilder, 
    private authentication: AuthenticationService,
    private unitSerivce: UnitService,
    private dialogService: DialogService,
    private utility: UtilityService
  ) {
    this.addProductForm = fb.group({
      code: [null, [Validators.required, CustomValidators.code]],
      productCode: ["", Validators.required],
      productType: [1, Validators.required],
      name: ["", Validators.required],
      price: [null, Validators.required],
      taxPercent: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
      unitCode: [null, Validators.required],
      unitCodeSearch: [null],
      otherLegalFunds: [''],
      otherLegalFundsPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      otherTax: [""],
      otherTaxPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    })
  }

  ngOnInit(): void {
    this.unitSerivce.getUnitList({ pageSize: 9999 }).subscribe(res => {
      this.getUnitListLoading = false;
      this.unitList = res.result;
      this.filteredUnitList = res.result;
    })

    this.productService.getNewProductCode({}).subscribe(res => {
      this.addProductForm.get('code')?.patchValue(res.newCode);
    })

    this.addProductForm.get("unitCodeSearch")?.valueChanges.subscribe(value => {
      this.filteredUnitList = this.unitList.filter(unit => unit.name.includes(value));
    })
  }

  public onAddProduct(): void {
    if (this.addProductForm.valid) {
      this.addProductLoading = true;
      const addProductBody: AddProductBody = {
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

  public onSearchProductId(): void {
    if (this.addProductForm.get("productType")?.value) {
      this.dialogService.openDialog(ProductIdSearchComponent, {
        width: '556px',
        data: {
          productName: this.addProductForm.controls["name"].value,
          isService: this.addProductForm.get("productType")?.value === ProductType.Service
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.addProductForm.get("productCode")?.patchValue(result);
        }
      })
    }
    else {
      this.addProductForm.get("productType")?.markAsTouched();
    }
  }

  public closeDialog(value?: any): void {
    this.dialgoRef.close(value);
  }
}
