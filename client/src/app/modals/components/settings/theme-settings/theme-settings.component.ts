import { Component } from '@angular/core';
import { ThemeService } from '@app/app/services/theme.service';
import { BackgroundPattern } from '@app/tools/enums/background-pattern';

@Component({
    selector: 'app-theme-settings',
    templateUrl: './theme-settings.component.html',
    styleUrls: ['./theme-settings.component.scss'],
})
export class ThemeSettingsComponent {
    BackgroundPattern = BackgroundPattern;
    readonly themeColors = ['pink', 'purple', 'teal', 'blue', 'green', 'lime', 'yellow', 'orange', 'red', 'brown'];

    constructor(private themeService: ThemeService) {}

    set color(color: string) {
        this.themeService.color = color;
    }

    get isDarkTheme(): boolean {
        return this.themeService.isDarkTheme;
    }

    set isDarkTheme(isDarkTheme: boolean) {
        this.themeService.isDarkTheme = isDarkTheme;
    }

    get currentBackgroundPattern(): BackgroundPattern {
        return this.themeService.backgroundPattern;
    }

    set currentBackgroundPattern(pattern: BackgroundPattern) {
        this.themeService.backgroundPattern = pattern;
        this.themeService.refreshBackgroundPattern();
    }
}
