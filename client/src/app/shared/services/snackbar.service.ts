import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const defaultSnackbarDuration = 4000;

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private snackbar: MatSnackBar) {}

    displayMessage(message: string, messageDuration: number = defaultSnackbarDuration): void {
        this.snackbar.open(message, undefined, {
            duration: messageDuration,
        });
    }

    displayDismissableMessage(displayedMessage: string, dismissalMessage: string): void {
        this.snackbar.open(displayedMessage, dismissalMessage);
    }
}
