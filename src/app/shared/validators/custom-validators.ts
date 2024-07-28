import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Person } from "src/app/software/types/person.type";

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

        if (value.toString().startsWith("09")) return null;

        return value.toString().length !== 10 ? { phoneNumber: true } : null;
    }

    public static economicCode(formControl: AbstractControl): ValidationErrors | null {
        const value = formControl.value as number;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 12 ? { economicCode: true } : null;
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