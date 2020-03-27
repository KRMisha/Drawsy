import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private _color = 'blue'; // tslint:disable-line: variable-name
    private _isDarkTheme = true; // tslint:disable-line: variable-name

    constructor(private overlayContainer: OverlayContainer) {
        overlayContainer.getContainerElement().classList.add('blue-dark-theme');
    }

    toggleDarkTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
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
    }

    get isDarkTheme(): boolean {
        return this._isDarkTheme;
    }

    set isDarkTheme(isDarkTheme: boolean) {
        const oldTheme = this.theme;
        this._isDarkTheme = isDarkTheme;
        this.overlayContainer.getContainerElement().classList.replace(oldTheme, this.theme);
    }
}
