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

    public static englishOnly(formControl: AbstractControl): CustomValidationErrors | null {
        if (formControl.value == null) {
            return null;
        }
        const pattern = /^[a-zA-Z0-9\s]*$/;
        const valid = pattern.test(formControl.value);
        return !valid ? { englishOnly: true } : null;
    }

    public static nationalId(formControl: AbstractControl): CustomValidationErrors | null {
        const value = formControl.value;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 10 ? { nationalId: true } : null;
    }

    public static zipCode(formControl: AbstractControl): CustomValidationErrors | null {
        const value = formControl.value;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 10 ? { zipCode: true } : null;
    }

    public static invalid(formControl: AbstractControl): CustomValidationErrors {
        return { invalid: true }
    }

    public static phoneNumber(formControl: AbstractControl): CustomValidationErrors | null {
        const value = formControl.value;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 10 ? { phoneNumber: true } : null;
    }

    public static homePhoneNumber(formControl: AbstractControl): CustomValidationErrors | null {
        const value = formControl.value;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length < 5 ? { homePhoneNumber: true } : null;
    }

    public static economicCode(formControl: AbstractControl): CustomValidationErrors | null {
        const value = formControl.value;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length !== 12 ? { economicCode: true } : null;
    }

    public static economicOrNationalCode(formControl: AbstractControl): CustomValidationErrors | null {
        const value = formControl.value;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length < 10 ? { economicOrNationalCode: true } : null;
    }

    public static taxIdentity(formControl: AbstractControl): CustomValidationErrors | null {
        const value = formControl.value;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length > 6 ? { taxIdentity: true } : null;
    }

    public static branchNo(formControl: AbstractControl): CustomValidationErrors | null {
        const value = formControl.value;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length > 4 ? { branchNo: true } : null;
    }

    public static code(formControl: AbstractControl): CustomValidationErrors | null {
        const value = formControl.value;

        if (!value) return null;

        if (!value.toString().length) return null;

        return value.toString().length > 10 ? { code: true } : null;
    }

    public static getValidatorMessage(validator: string): string {
        switch (validator) {
            case 'code': return 'کد تفضیلی نامعتبر میباشد.';

            case 'branchNo': return "کد شعبه حداکثر چهار رقم میباشد.";

            case 'taxIdentity': return 'شناسه یکتا حداکثر شش رقم میباشد.';

            case 'economicOrNationalCode': return 'کد ملی یا اقتصادی نامعتبر میباشد.';

            case 'economicCode': return 'کد اقتصادی سیزده رقم میباشد.';

            case 'homePhoneNumber': return 'شماره ثابت حداقل پنج رقم میباشد.';

            case 'phoneNumber': return 'شماره تماس ده رقم میباشد.';

            case 'invalid': return 'فیلد همیشه نامعتبر میباشد';

            case 'zipCode': return 'کد پستی ده رقم میباشد.';

            case 'nationalId': return 'کد ملی ده رقم میباشد';

            case 'englishOnly': return 'فقط حروف انگلیسی مجاز میباشد';

            case 'passwordMismatch': return 'رمز عبور مطابقت ندارد';

            case 'required': return 'این فیلد الزامی میباشد.';

            default: return 'اطلاعات وارد شده نامعتبر میباشد';
        }
    }
}

export type CustomValidator = 'code' | 'branchNo' | 'taxIdentity' | 'economicOrNationalCode' | 'economicCode' | 'homePhoneNumber' | 'phoneNumber' | 'invalid' | 'zipCode' | 'nationalId' | 'englishOnly' | 'passwordMismatch';

export type DefaultValidator = 'required'

type CustomValidationErrors = {
    [key in CustomValidator]?: boolean;
}