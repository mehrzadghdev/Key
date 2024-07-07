import { Component } from '@angular/core';
import { Product } from '../../types/product.type';
import { ProductType } from '../../enums/product-type.enum';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { Company } from '../../types/company.type';
import { CreateProductComponent } from '../create-product/create-product.component';
import { Unit } from '../../types/unit.type';
import { UnitService } from '../../services/unit.service';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent {
  public productList: Product[] = [];
  public unitList: Unit[] = [];
  public productListLoaded: boolean = false;
  public unitListLoaded: boolean = false;
  public tableColumns: string[] = ["نوع", "نام", "شناسه کالا", "واحد کالا", "قیمت", "کد کالا", "عملیات"];
  public productTypes = [
    { display: 'کالا', value: ProductType.Product },
    { display: 'خدمات', value: ProductType.Service },
  ]
  
  constructor(
    private authentication: AuthenticationService, 
    private router: Router, 
    private productSerivce: ProductService, 
    private unitService: UnitService,
    private dialog: DialogService,
    private utility: UtilityService
  ) {}
    
  public productTypeTextByNumber(productType: ProductType): string {
    return this.productTypes.find(product => product.value === productType)?.display ?? "نامشخص";
  }

  ngOnInit(): void {
    this.loadProductList();
    this.loadUnitList();
  }

  public loadUnitList(): void {
    this.unitListLoaded = false;

    this.unitService.getUnitList().subscribe(res => {
      this.unitList = res;
      this.unitListLoaded = true;
    })
  }


  public loadProductList(): void {
    this.productListLoaded = false;
  
    const currentCompany = this.authentication.currentCompany as Company;

    this.productSerivce.getCompaniesProductList({ databaseId: currentCompany.databaseId }).subscribe(res => {
      this.productList = res;
      this.productListLoaded = true;
    })
  }

  public onDeleteProduct(productCodeToDelete: number): void {
    this.dialog.openAcceptDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.productSerivce.deleteProduct({ code: productCodeToDelete }).subscribe(res => {
          this.utility.message('کالا یا خدمات با موفقیت حذف شد.', 'بستن');
          this.loadProductList();
        })
      }
    })
  }

  public findUnitName(unitCode: number): string {
    return this.unitList.find(unit => unit.code === unitCode)?.name ?? 'نامشخص';
  }

  public onAddProduct(): void {
    this.dialog.openFormDialog(CreateProductComponent, {
      width: "456px"
    }).afterClosed().subscribe(res => {
      this.loadProductList()
    })
  }

  public onUpdateProduct(code: number) {
    this.dialog.openFormDialog(UpdateProductComponent, {
      width: "456px",
      data: {
        code: code
      }
    }).afterClosed().subscribe(res => {
      this.loadProductList()
    })
    return;
  }

  public onSearch(searchQuery: string) {
    if (searchQuery && this.productListLoaded) {
      const filteredData = this.productList.filter(product => {
        for (const [key, value] of Object.entries(product)) {
          if (typeof value === 'string' && value.includes(searchQuery)) {
            return true
          }
          if (typeof value === 'number'&& value.toString().includes(searchQuery)) {
            return true
          }
        }
  
        return;
      })
  
      this.productList = filteredData;
    }
    else {
      this.loadProductList();
    }
  }
}
