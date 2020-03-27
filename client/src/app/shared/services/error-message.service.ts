import { AbstractControl } from '@angular/forms';

export class ErrorMessageService {
    static getErrorMessage(formControl: AbstractControl, humanFriendlyPattern?: string): string {
        return formControl.hasError('required')
            ? ErrorMessageService.getRequiredErrorMessage()
            : formControl.hasError('pattern')
            ? ErrorMessageService.getPatternErrorMessage(
                  humanFriendlyPattern === undefined ? formControl.getError('pattern').requiredPattern : humanFriendlyPattern
              )
            : formControl.hasError('min')
            ? ErrorMessageService.getMinimumValueErrorMessage(formControl.getError('min').min)
            : formControl.hasError('max')
            ? ErrorMessageService.getMaximumValueErrorMessage(formControl.getError('max').max)
            : formControl.hasError('minlength')
            ? ErrorMessageService.getMinimumLengthErrorMessage(formControl.getError('minlength').requiredLength)
            : formControl.hasError('maxlength')
            ? ErrorMessageService.getMaximumLengthErrorMessage(formControl.getError('maxlength').requiredLength)
            : '';
    }

    private static getRequiredErrorMessage(): string {
        return 'Champ obligatoire';
    }

    private static getPatternErrorMessage(pattern: string): string {
        return pattern + ' uniquement';
    }

    private static getMinimumValueErrorMessage(value: number): string {
        return `Minimum: ${value}`;
    }

    private static getMaximumValueErrorMessage(value: number): string {
        return `Maximum: ${value}`;
    }

    private static getMinimumLengthErrorMessage(length: number): string {
        return `Minimum ${length} caractères`;
    }

    private static getMaximumLengthErrorMessage(length: number): string {
        return `Maximum ${length} caractères`;
    }
}
