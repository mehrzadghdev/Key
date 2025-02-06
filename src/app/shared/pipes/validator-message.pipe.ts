import { Pipe, PipeTransform } from '@angular/core';
import { CustomValidator, CustomValidators, DefaultValidator } from '../validators/custom-validators';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'validatorMessage'
})
export class ValidatorMessagePipe implements PipeTransform {

  transform(validatorName: string): string {
    return CustomValidators.getValidatorMessage(validatorName);
  }

}
