import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const snackBarDuration = 4000;

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private snackBar: MatSnackBar) {}

    displayMessage(message: string, messageDuration: number = snackBarDuration): void {
        this.snackBar.open(message, undefined, {
            duration: messageDuration,
        });
    }

    displayDismissableMessage(displayedMessage: string, dismissalMessage: string): void {
        this.snackBar.open(displayedMessage, dismissalMessage);
    }
}
