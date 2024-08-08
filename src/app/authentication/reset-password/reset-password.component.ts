import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { ResetPasswordBody } from 'src/app/shared/types/authentication.type';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private resetPasswordToken: string = '';
  public resetPasswordForm: FormGroup;
  public resetPasswordLoading: boolean = false;
  public validateForm: boolean = false;
  public passwordVisible: boolean = false;

  constructor(
    private authentication: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private utilityService: UtilityService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        email: [null],
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required]
      },
      {
        validators: CustomValidators.confirmPassword('password', 'confirmPassword'),
      }
    )

    this.resetPasswordForm.get("email")?.disable(); 
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      this.resetPasswordToken = param['token'];
      this.resetPasswordForm.get("email")?.patchValue(param['email']);
    })
  }

  public onForgetPassword(): void {
    if (!this.resetPasswordToken) {
      this.utilityService.message("توکن بازیابی رمز عبور نامعتبر است", "بستن");
      return;
    }

    if (!this.resetPasswordForm.get("email")?.value) {
      this.utilityService.message("توکن بازیابی رمز عبور نامعتبر است", "بستن");
      return;
    }
    
    if (this.resetPasswordForm.valid) {
      this.resetPasswordLoading = true;
      
      const resetPasswordBody: ResetPasswordBody = {
        password: this.resetPasswordForm.get("password")?.value,
        confirmPassword: this.resetPasswordForm.get("confirmPassword")?.value,
        email: this.resetPasswordForm.get("email")?.value,
        token: this.resetPasswordToken
      }

      this.authentication.resetPassword(resetPasswordBody).subscribe(
        result => {
          this.resetPasswordLoading = false;
          if (result) {
            this.utilityService.message("رمز عبور با موفقیت تغییر یافت", 'بستن');
            this.router.navigate(['/auth/login']);
          }
          else {
            this.utilityService.message("تغییر رمز عبور با خطا مواجه شد", 'بستن');
          }
        },
        err => {
          this.utilityService.message("تغییر رمز عبور با خطا مواجه شد", 'بستن');
          this.resetPasswordLoading = false;
        }
      );
    }
    else {
      this.validateForm = true;
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}
