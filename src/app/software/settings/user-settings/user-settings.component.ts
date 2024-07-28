import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UpdateUserBody, UserDetails } from 'src/app/shared/types/authentication.type';
import { Theme } from 'src/app/shared/types/theme.type';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  public userDetails!: UserDetails;
  public beforeSaveUserDetails!: UserDetails;
  public userSettingsForm: FormGroup;
  public beforeSaveActiveTheme: Theme = 'default';
  public activeTheme: Theme = 'default';
  public validationLastCheck: boolean = true;
  public detailsChanged: boolean = true;
  public updateUserLoading: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private utility: UtilityService,
    private themeService: ThemeService
  ) {
    this.userSettingsForm = this.fb.group({
      email: [],
      packageNo: [],
      name: ['', Validators.required],
      family: ['', Validators.required],
      phoneNumber: ['', [CustomValidators.phoneNumber]],
      password: ['**********']
    })

    this.userSettingsForm.get("email")?.disable();
  }

  ngOnInit(): void {
    this.activeTheme = this.themeService.getColorTheme();
    this.beforeSaveActiveTheme = this.themeService.getColorTheme();
    this.beforeSaveUserDetails = this.authenticationService.userDetails as UserDetails;
    this.userDetails = this.authenticationService.userDetails as UserDetails;
    this.autoFillForm(this.userDetails)
    
    this.authenticationService.userInfo().subscribe(result => {
      this.beforeSaveUserDetails = this.authenticationService.userDetails as UserDetails;
      this.userDetails = result;
      this.autoFillForm(this.userDetails)
    })
  }

  public enableResetButton(): void {
    this.detailsChanged = false;
  }

  public setActiveTheme(theme: Theme): void {
    if (this.activeTheme !== theme) {
      this.activeTheme = theme;
      this.enableResetButton();
    }
  }

  public onResetToDefault(): void {
    this.userDetails = this.beforeSaveUserDetails;
    this.activeTheme = this.beforeSaveActiveTheme;
    this.autoFillForm(this.userDetails);

    this.detailsChanged = true;
  }

  public onUpdateUser(): void {
    if (!this.userSettingsForm.invalid) {
      this.updateUserLoading = true;

      const updateUserBody: UpdateUserBody = {
        name: this.userSettingsForm.get("name")?.value,
        family: this.userSettingsForm.get("family")?.value,
        phoneNumber: this.userSettingsForm.get("phoneNumber")?.value + "",
      } 
  
      this.authenticationService.updateUser(this.userDetails.id ,updateUserBody).subscribe(res => {
        this.themeService.setColorTheme(this.activeTheme);
        this.detailsChanged = true;
        this.utility.message("تنظیمات کاربری با موفقیت ذخیره شد", "بستن");

        this.authenticationService.userInfo().subscribe(userDetails => {
          this.userDetails = userDetails;
          this.beforeSaveUserDetails = userDetails;
          this.authenticationService.userDetails = userDetails;

        });
        this.updateUserLoading = false;
      })
    }
    else {
      this.validationLastCheck = true;
      this.userSettingsForm.markAllAsTouched();
    }
  }

  public autoFillForm(userDetails: UserDetails): void {
    this.userSettingsForm.get("email")?.patchValue(userDetails.email);
    this.userSettingsForm.get("packageNo")?.patchValue(userDetails.packageNo);
    this.userSettingsForm.get("name")?.patchValue(userDetails.name);
    this.userSettingsForm.get("family")?.patchValue(userDetails.family);
    this.userSettingsForm.get("phoneNumber")?.patchValue(userDetails.phoneNumber);
  }
}
