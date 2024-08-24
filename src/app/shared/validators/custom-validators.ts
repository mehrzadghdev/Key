import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Person } from "src/app/software/types/definitions/person.type";

export abstract class CustomValidators {
    public static confirmPassword(password: string, confirmPassword: string) {
        return (formGroup: FormGroup): any => {
            const passwordControl = formGroup.controls[password];
            const confirmPasswordControl = formGroup.controls[confirmPassword];

            if (!passwordControl || !confirmPasswordControl) {
                return null;
            }

            if (confirmPasswordControl.errors && !confirmPasswordControl.errors["passwordMismatch"]) {
                return null;
            }

            if (passwordControl.value !== confirmPasswordControl.value) {
                confirmPasswordControl.setErrors({ passwordMismatch: true });
            }
            else {
                confirmPasswordControl.setErrors(null);
            }
        }
    }

    public static englishOnly(formControl: AbstractControl): ValidationErrors | null {
        if (formControl.value == null) {
            return null;
        }
        const pattern = /^[a-zA-Z0-9\s]*$/;
        const valid = pattern.test(formControl.value);
        return !valid ? { englishOnly: true } : null;
    }


    public static nationalId(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 10 ? { nationalId: true } : null;
    }

    public static zipCode(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 10 ? { zipCode: true } : null;
    }

    public static invalid(formControl: AbstractControl): ValidationErrors {
        return { invalid: true }
    }

    public static phoneNumber(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 10 ? { phoneNumber: true } : null;
    }

    public static homePhoneNumber(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 8 ? { phoneNumber: true } : null;
    }

    public static economicCode(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 12 ? { economicCode: true } : null;
    }

    public static economicOrNationalCode(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length < 10 ? { economicOrNationalCode: true } : null;
    }

    public static taxIdentity(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length > 6 ? { taxIdentity: true } : null;
    }

    public static branchNo(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length > 4 ? { economicCode: true } : null;
    }

    public static code(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length > 10 ? { code: true } : null;
    }
}