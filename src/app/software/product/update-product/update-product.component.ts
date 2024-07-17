import { Component, Inject } from '@angular/core';
import { UpdateProductBody } from '../../types/product.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Unit } from '../../types/unit.type';
import { ProductType } from '../../enums/product-type.enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UnitService } from '../../services/unit.service';
import { Company } from '../../types/company.type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

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
    private unitSerivce: UnitService,
    @Inject(MAT_DIALOG_DATA) private data: { code: number }
  ) {
    this.updateProductForm = fb.group({
      code: [data.code, [Validators.required, CustomValidators.code]],
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
        this.closeDialog();
      })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public closeDialog(): void {
    this.dialgoRef.close();
  }
}
