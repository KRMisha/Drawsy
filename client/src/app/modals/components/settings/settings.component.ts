import { Component } from '@angular/core';
import { SettingsService } from '@app/modals/services/settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [SettingsService]
})
export class SettingsComponent {
    constructor(private settingsService: SettingsService) {}

    resetInitialSettings(): void {
        this.settingsService.resetInitialSettings();
    }
}
