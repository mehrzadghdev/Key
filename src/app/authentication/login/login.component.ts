import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { LoginBody } from 'src/app/shared/types/authentication.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })
  public loginLoading: boolean = false;
  public passwordVisible: boolean = false;
  public validateForm: boolean = false;

  constructor(
    private authentication: AuthenticationService, 
    private router: Router,
    private fb: FormBuilder,
    private utilityService: UtilityService 
  ) { }

  public onLogin(): void {
    if (this.loginForm.valid) {
      this.loginLoading = true;
      
      const loginBody: LoginBody = {
        email: this.loginForm.get("email")?.value,
        password: this.loginForm.get("password")?.value,
        twoFactorCode: null,
        twoFactorRecoveryCode: null
      }
      
      this.authentication.login(loginBody).subscribe({
        next: (result) => {
          this.authentication.accessToken = result.accessToken;
          this.authentication.tokenExpireDate = result.expiresIn;
          
          this.router.navigate(['/software']);
          this.loginLoading = false;
          this.utilityService.message("ورود به حساب کاربری با موفقیت انجام شد.", 'بستن')
        },
        error: (err) => {
          this.loginLoading = false;
        }
      })
    }
    else {
      this.validateForm = true;
    }
  }

  public loginControl(value: string): AbstractControl | null {
    return this.loginForm.get(value);
  }
}
