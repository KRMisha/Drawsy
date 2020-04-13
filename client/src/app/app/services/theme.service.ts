import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

const localStorageThemeColorKey = 'themeColor';
const localStorageThemeIsDarkKey = 'themeIsDark';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private _color = 'blue'; // tslint:disable-line: variable-name
    private _isDarkTheme = true; // tslint:disable-line: variable-name

    constructor(private overlayContainer: OverlayContainer) {
        this.getSettingsFromStorage();
        overlayContainer.getContainerElement().classList.add(this.theme);
    }

    get theme(): string {
        return `${this._color}-${this.isDarkTheme ? 'dark' : 'light'}-theme`;
    }

    get color(): string {
        return this._color;
    }

    set color(color: string) {
        const oldTheme = this.theme;
        this._color = color;
        this.overlayContainer.getContainerElement().classList.replace(oldTheme, this.theme);
        this.saveSettingsToStorage();
    }

    get isDarkTheme(): boolean {
        return this._isDarkTheme;
    }

    set isDarkTheme(isDarkTheme: boolean) {
        const oldTheme = this.theme;
        this._isDarkTheme = isDarkTheme;
        this.overlayContainer.getContainerElement().classList.replace(oldTheme, this.theme);
        this.saveSettingsToStorage();
    }

    private getSettingsFromStorage(): void {
        const colorString = localStorage.getItem(localStorageThemeColorKey);
        if (colorString !== null) {
            this._color = colorString;
        }

        const isDarkThemeString = localStorage.getItem(localStorageThemeIsDarkKey);
        if (isDarkThemeString !== null) {
            this._isDarkTheme = JSON.parse(isDarkThemeString);
        }
    }

    private saveSettingsToStorage(): void {
        localStorage.setItem(localStorageThemeColorKey, this.color);
        localStorage.setItem(localStorageThemeIsDarkKey, JSON.stringify(this._isDarkTheme));
    }
}
