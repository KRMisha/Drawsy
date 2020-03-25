import { Component } from '@angular/core';
import { ThemeService } from '@app/shared/services/theme.service';

@Component({
    selector: 'app-theme-settings',
    templateUrl: './theme-settings.component.html',
    styleUrls: ['./theme-settings.component.scss'],
})
export class ThemeSettingsComponent {
    readonly themeColors = ['pink', 'purple', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red'];

    constructor(private themeService: ThemeService) {}

    toggleDarkTheme(): void {
        this.themeService.toggleDarkTheme();
    }

    set color(color: string) {
        this.themeService.color = color;
    }

    get isDarkTheme(): boolean {
        return this.themeService.isDarkTheme;
    }
}
