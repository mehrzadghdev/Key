import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { LoginBody } from 'src/app/shared/types/authentication.type';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  public forgetPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  })
  public forgetPasswordLoading: boolean = false;
  public validateForm: boolean = false;
  public forgetPasswordResult: boolean | null = null;

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private fb: FormBuilder,
    private utilityService: UtilityService
  ) { }

  public onForgetPassword(): void {
    if (this.forgetPasswordForm.valid) {
      this.forgetPasswordLoading = true;
      this.authentication.forgetPassword({ email: this.forgetPasswordForm.get("email")?.value }).subscribe(
        result => {
          this.forgetPasswordLoading = false;
          if (result) {
            this.forgetPasswordResult = true;
          }
        },
        err => {
          this.forgetPasswordLoading = false;
          this.forgetPasswordResult = false;
        }
      );
    }
    else {
      this.validateForm = true;
    }
  }
}
