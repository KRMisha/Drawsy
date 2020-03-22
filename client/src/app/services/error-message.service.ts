import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ErrorMessageService {
    static getRequiredErrorMessage(): string {
        return 'Champ obligatoire';
    }

    static getPatternErrorMessage(pattern: string): string {
        return pattern + ' uniquement';
    }

    static getMinimumLengthErrorMessage(length: number): string {
        return `Longeur minimale de ${length} caractères`;
    }

    static getMaximumLengthErrorMessage(length: number): string {
        return `Longeur maximale de ${length} caractères`;
    }
}
