import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { LoginApiBody, RegisterApiBody } from 'src/app/shared/types/authentication.type';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	public registerForm: FormGroup = this.fb.group(
		{
			email: ['', [Validators.required, Validators.email]],
			phone: ['', [Validators.required]],
			password: ['', [Validators.required]],
			confirmPassword: ['', [Validators.required]],
			name: ['', [Validators.required]],
			family: ['', [Validators.required]],
		},
		{
			validators: CustomValidators.confirmPassword('password', 'confirmPassword'),
		}
	)
	public registerLoading: boolean = false;
	public passwordVisible: boolean = false;
	public validateForm: boolean = false;

	constructor(
		private authentication: AuthenticationService,
		private router: Router,
		private fb: FormBuilder,
		private utility: UtilityService
	) { }

	public onRegister(): void {
		if (this.registerForm.valid) {
			this.registerLoading = true;

			const registerBody: RegisterApiBody = {
				email: this.registerForm.get("email")?.value,
				password: this.registerForm.get("password")?.value,
				name: this.registerForm.get("name")?.value,
				family: this.registerForm.get("family")?.value,
				phoneNumber: (this.registerForm.get("phone")?.value) + '',
				salePatternCount: 0,
				currencyPatternCount: 0,
				goldPatternCount: 0,
				projectPatternCount: 0,
				servicePatternCount: 0,
				airTicketPatternCount: 0,
				exportPatternCount: 0
			}

			this.authentication.register(registerBody).subscribe({
				next: (result) => {
					const loginBody: LoginApiBody = {
						email: registerBody.email,
						password: registerBody.password,
						twoFactorCode: null,
						twoFactorRecoveryCode: null,
					}

					this.authentication.login(loginBody).subscribe({
						next: (loginResult) => {
							this.authentication.accessToken = loginResult.accessToken;
							this.authentication.tokenExpireDate = loginResult.expiresIn;

							this.authentication.userInfo().subscribe(result => {
								this.authentication.userDetails = result;
								this.registerLoading = false;
								this.utility.message("ساخت حساب کاربری انجام شد.", 'بستن');
								this.router.navigate(['/software']);
							})
						},
						error: (err) => {
							this.registerLoading = false;
							this.utility.message("ساخت حساب کاربری انجام شد، لطفا وارد حساب شوید.", 'بستن');
							this.router.navigate(['/auth/login']);
						}
					})
				},
				error: (err) => {
					this.utility.message("آدرس ایمیل تکراری است، در صورت نیاز وارد حساب کاربری شوید", 'بستن');
					this.registerLoading = false;
				}
			})
		}
		else {
			this.validateForm = true
		}
	}

	public registerControl(value: string): AbstractControl | null {
		return this.registerForm.get(value);
	}
}
