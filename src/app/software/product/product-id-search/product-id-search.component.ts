import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';

@Component({
  selector: 'app-product-id-search',
  templateUrl: './product-id-search.component.html',
  styleUrls: ['./product-id-search.component.scss']
})
export class ProductIdSearchComponent implements OnInit {
  public productIdSearchForm: FormGroup;
  public validationLastCheck: boolean = false;
  public productIdSearchLoading: boolean = false;
  public selectedProductId?: number;
  
  constructor(
    private dialgoRef: MatDialogRef<ProductIdSearchComponent>, 
    private fb: FormBuilder,
    private utility: UtilityService,
    @Inject(MAT_DIALOG_DATA) private data: { productName: string }
  ) {
    this.productIdSearchForm = fb.group({
      searchQuery: ['']
    })
  }

  ngOnInit(): void {
    if (this.data.productName) {
      this.productIdSearchForm.get("searchQuery")?.patchValue(this.data.productName);
      this.searchForProductId();
    }

    this.productIdSearchForm.get("searchQuery")?.valueChanges.subscribe(res => {
      
    })
  }

  public searchForProductId(): void {
    // TODO
  }

  public onProductIdSelected(): void {
    this.closeDialog(this.selectedProductId);
  }

  public closeDialog(value?: any): void {
    this.dialgoRef.close(value);
  }
}
