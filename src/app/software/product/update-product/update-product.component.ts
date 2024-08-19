import { Component, Inject } from '@angular/core';
import { UpdateProductBody } from '../../types/definitions/product.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Unit } from '../../types/definitions/unit.type';
import { ProductType } from '../../enums/product-type.enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/definitions/product.service';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { UnitService } from '../../services/definitions/unit.service';
import { Company } from '../../types/definitions/company.type';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { ProductIdSearchComponent } from '../product-id-search/product-id-search.component';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
  public updateProductForm: FormGroup;
  public validationLastCheck: boolean = false;
  public updateProductLoading: boolean = false;
  public getUnitListLoading: boolean = true;
  public getProductLoading: boolean = true;
  public unitList: Unit[] = [];
  public filteredUnitList: Unit[] = [];
  public productTypes = [
    { display: 'کالا', value: ProductType.Product },
    { display: 'خدمات', value: ProductType.Service },
  ]
  
  constructor(
    private dialgoRef: MatDialogRef<UpdateProductComponent>, 
    private productService: ProductService, 
    private fb: FormBuilder, 
    private utility: UtilityService,
    private authentication: AuthenticationService,
    private dialogService: DialogService,
    private unitSerivce: UnitService,
    @Inject(MAT_DIALOG_DATA) private data: { code: number }
  ) {
    this.updateProductForm = fb.group({
      code: [data.code, [Validators.required, CustomValidators.code]],
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
      this.filteredUnitList = res.result;
      this.unitList = res.result;
    })

    this.updateProductForm.get("code")?.disable();
    this.productService.getProduct({ code: this.data.code }).subscribe(res => {
      this.updateProductForm.patchValue({
        code: this.data.code ?? '', 
        productCode: res[0].productCode,
        productType: res[0].productType,
        name: res[0].name,
        price: res[0].price,
        taxPercent: res[0].taxPercent,
        unitCode: res[0].unitCode,
        otherLegalFunds: res[0].otherLegalFunds,
        otherLegalFundsPercent:  res[0].otherLegalFundsPercent,
        otherTax:  res[0].otherTax,
        otherTaxPercent:  res[0].otherLegalFundsPercent
      })

      this.getProductLoading = false;
    })

    this.updateProductForm.get("unitCodeSearch")?.valueChanges.subscribe(value => {
      console.log("called");
      this.filteredUnitList = this.unitList.filter(unit => unit.name.includes(value));
    })
  }

  public onUpdateProduct(): void {
    if (this.updateProductForm.valid) {
      this.updateProductLoading = true;
      const updateProductBody: UpdateProductBody = {
        code: this.updateProductForm.controls["code"].value,
        productType: this.updateProductForm.controls["productType"].value,
        productCode: this.updateProductForm.controls["productCode"].value,
        name: this.updateProductForm.controls["name"].value,
        price: this.updateProductForm.controls["price"].value,
        taxPercent: this.updateProductForm.controls["taxPercent"].value,
        unitCode: this.updateProductForm.controls["unitCode"].value,
        otherLegalFunds: this.updateProductForm.controls["otherLegalFunds"].value,
        otherLegalFundsPercent: this.updateProductForm.controls["otherLegalFundsPercent"].value,
        otherTax: this.updateProductForm.controls["otherTax"].value,
        otherTaxPercent: this.updateProductForm.controls["otherTaxPercent"].value
      }

      this.productService.updateProduct(updateProductBody).subscribe(res => {
        this.updateProductLoading = false;
        this.utility.message((this.updateProductForm.controls["productType"].value === ProductType.Product ? 'کالا' : 'خدمات') + ' با موفقیت ویرایش شد.', 'بستن');
        this.closeDialog(updateProductBody.productCode);
      })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public onSearchProductId(): void {
    if (this.updateProductForm.get("productType")?.value) {
      this.dialogService.openDialog(ProductIdSearchComponent, {
        width: '656px',
        data: {
          productName: this.updateProductForm.controls["name"].value,
          isService: this.updateProductForm.get("productType")?.value === ProductType.Service
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.updateProductForm.get("productCode")?.patchValue(result);
        }
      })
    }
    else {
      this.updateProductForm.get("productType")?.markAsTouched();
    }
  }

  public closeDialog(value?: any): void {
    this.dialgoRef.close(value);
  }
}
