import { Injectable, OnDestroy } from '@angular/core';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { Subscription } from 'rxjs';

const localStorageSudoModeKey = 'isSudoModeEnabled';

@Injectable({
    providedIn: 'root',
})
export class SudoModeService implements OnDestroy {
    private isSudoModeEnabled = false;

    private toggleSudoModeSubscription: Subscription;

    constructor(private shortcutService: ShortcutService, private snackbarService: SnackbarService) {
        this.isSudoModeEnabled = localStorage.getItem(localStorageSudoModeKey) !== null;

        this.toggleSudoModeSubscription = this.shortcutService.toggleSudoMode$.subscribe(() => {
            this.toggleSudoMode();
        });
    }

    ngOnDestroy(): void {
        this.toggleSudoModeSubscription.unsubscribe();
    }

    authenticateSudo(): boolean {
        if (!this.isSudoModeEnabled) {
            this.snackbarService.displayMessage('Erreur : action non autorisée');
        }

        return this.isSudoModeEnabled;
    }

    private toggleSudoMode(): void {
        this.isSudoModeEnabled = !this.isSudoModeEnabled;

        if (this.isSudoModeEnabled) {
            localStorage.setItem(localStorageSudoModeKey, 'true');
        } else {
            localStorage.removeItem(localStorageSudoModeKey);
        }

        this.snackbarService.displayMessage(`Mode sudo ${this.isSudoModeEnabled ? 'activé' : 'désactivé'}`);
    }
}
