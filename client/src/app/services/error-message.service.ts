import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ErrorMessageService {
    static getErrorMessage(control: AbstractControl, humanFriendlyPattern?: string): string {
        return control.hasError('required')
            ? ErrorMessageService.getRequiredErrorMessage()
            : control.hasError('pattern')
            ? ErrorMessageService.getPatternErrorMessage(
                humanFriendlyPattern === undefined ? control.getError('pattern').requiredPattern : humanFriendlyPattern
              )
            : control.hasError('min')
            ? ErrorMessageService.getMinimumValueErrorMessage(control.getError('min').min)
            : control.hasError('max')
            ? ErrorMessageService.getMaximumValueErrorMessage(control.getError('max').max)
            : control.hasError('minlength')
            ? ErrorMessageService.getMinimumLengthErrorMessage(control.getError('minlength').requiredLength)
            : control.hasError('minlength')
            ? ErrorMessageService.getMaximumLengthErrorMessage(control.getError('maxlength').requiredLength)
            : '';
    }

    private static getRequiredErrorMessage(): string {
        return 'Champ obligatoire';
    }

    private static getPatternErrorMessage(pattern: string): string {
        return pattern + ' uniquement';
    }

    private static getMinimumValueErrorMessage(value: number): string {
        return `Valeur minimale de ${value}`;
    }

    private static getMaximumValueErrorMessage(value: number): string {
        return `Valeur maximale de ${value}`;
    }

    private static getMinimumLengthErrorMessage(length: number): string {
        return `Longeur minimale de ${length} caractères`;
    }

    private static getMaximumLengthErrorMessage(length: number): string {
        return `Longeur maximale de ${length} caractères`;
    }
}
