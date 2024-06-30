import { Component, ComponentRef } from '@angular/core';
import { Theme } from '../shared/types/theme.type';
import { ThemeService } from '../shared/services/theme.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { DialogService } from '../shared/services/dialog.service';
import { Router } from '@angular/router';
import { SelectCompanyComponent } from './company/select-company/select-company.component';
import { CreateCompanyComponent } from './company/create-company/create-company.component';
import { CreatePersonComponent } from './person/create-person/create-person.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { CompanyService } from './services/company.service';
import { UserDetails } from '../shared/types/authentication.type';
import { GetUsersCompanyListBody } from './types/company.type';
import { ListProductComponent } from './product/list-product/list-product.component';
import { ListPersonComponent } from './person/list-person/list-person.component';
import { ListCompanyComponent } from './company/list-company/list-company.component';
import { KeyModules } from '../shared/types/modules.type';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent {
  public isExpanded: boolean = true;

  get authDone(): boolean {
    return this.authentication.userLoggedIn;
  }

  get userDetails(): UserDetails {
    return this.authentication.userDetails as UserDetails;
  }

  public companySelected: boolean = false;

  get isMobile(): boolean {
    return window.screen.width <= 768;
  }

  get currentTheme(): Theme {
    return this.themeService.getColorTheme();
  }

  public currentActivatedRoute!: ComponentRef<ListProductComponent | ListPersonComponent | ListCompanyComponent>;
  public searchQuery: string = "";
  public fullscreen: boolean = true;

  constructor(
    private themeService: ThemeService,
    private dialog: DialogService,
    private router: Router,
    private authentication: AuthenticationService,
    private companyService: CompanyService
  ) {
    this.authentication.authorize();
  }

  ngOnInit(): void {
    const currentUserPackageNo: GetUsersCompanyListBody = {
      packageNo: (this.authentication.userDetails as UserDetails).packageNo
    } as const;

    if (this.authDone && !this.authentication.currentCompanySelected() && this.authentication.userDetails) {
      this.companyService.getUsersCompanyList(currentUserPackageNo).subscribe(res => {
        if (!res.length) {
          this.dialog.openFullScreenDialog(CreateCompanyComponent, {
            data: {
              firstCompany: true
            }
          }).afterClosed().subscribe(() => this.companySelected = true);
        }
        else {
          this.dialog.openFullScreenDialog(SelectCompanyComponent, {
            data: {
              companies: res,
              reSelect: false
            }
          }).afterClosed().subscribe(() => {
            this.companySelected = true
          });
        }
      })
    }
    else if (this.authDone && this.authentication.currentCompanySelected()) {
      this.companySelected = true;
    }
  }

  public onSearch(): void {
    if (this.searchQuery === "") {
      console.log("searching: ", this.searchQuery);
    }
  }

  public toggleFullScreen(): void {
    this.fullscreen = !this.fullscreen
    if (!this.fullscreen) {
      document.body.requestFullscreen();
    }
    else {
      document.exitFullscreen();
    }
  }

  public changeTheme(value: Theme) {
    this.themeService.setColorTheme(value);
  }

  public onLogout(): void {
    this.authentication.logout();
  }

  public toggleAccordion(accordion: HTMLLIElement): void {
    if (accordion.classList.contains("opened") && this.isExpanded) {
      accordion.classList.remove("opened");
    }
    else if (this.isExpanded) {
      accordion.classList.add("opened");
    }
  }

  public onRouteActivated(componentRef: ComponentRef<any>) {
    this.currentActivatedRoute = componentRef;
  }

  public onReSelectCompany(): void {
    this.dialog.openFullScreenDialog(SelectCompanyComponent, {
      data: {
        reSelect: true
      }
    }).afterClosed().subscribe(res => {
      if (this.currentActivatedRoute instanceof ListCompanyComponent) {
        this.currentActivatedRoute.loadCompanyList();
      }
      if (this.currentActivatedRoute instanceof ListPersonComponent) {
        this.currentActivatedRoute.loadPersonList();
      }
      if (this.currentActivatedRoute instanceof ListProductComponent) {
        // TODO: this.currentActivatedRoute.reloadProductList();
      }
    })
  }

  public onAddCompany(): void {
    this.dialog.openFullScreenDialog(CreateCompanyComponent, {
      data: {
        firstCompany: false,
        disableClose: false
      }
    }).afterClosed().subscribe(res => {
      if (this.currentActivatedRoute instanceof ListCompanyComponent) {
        this.currentActivatedRoute.loadCompanyList();
      }
    })
  }

  public onAddPerson(): void {
    this.dialog.openFormDialog(CreatePersonComponent, {
      width: "456px"
    }).afterClosed().subscribe(res => {
      if (this.currentActivatedRoute instanceof ListPersonComponent) {
        this.currentActivatedRoute.loadPersonList();
      }
    })
  }

  public onAddProduct(): void {
    this.dialog.openFormDialog(CreateProductComponent, {
      width: "456px"
    }).afterClosed().subscribe(res => {
      if (this.currentActivatedRoute instanceof ListProductComponent) {
        // TODO: this.currentActivatedRoute.reloadProductList();
      }
    })
  }

  public activeRouteIs(value: KeyModules): boolean {
    if (value === 'company') return this.currentActivatedRoute instanceof ListCompanyComponent;
    if (value === 'person') return this.currentActivatedRoute instanceof ListPersonComponent;
    if (value === 'product') return this.currentActivatedRoute instanceof ListProductComponent;
    //TODO: if (value === 'company') return this.currentActivatedRoute instanceof ListCompanyComponent;
    //TODO: if (value === 'company') return this.currentActivatedRoute instanceof ListCompanyComponent;

    return false;
  }
}
