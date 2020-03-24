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

    getTheme(): string {
        return `${this._color}-${this.isDarkTheme ? 'dark' : 'light'}-theme`;
    }

    toggleDarkTheme(): void {
        const oldTheme = this.getTheme();
        this._isDarkTheme = !this._isDarkTheme;
        this.overlayContainer.getContainerElement().classList.replace(oldTheme, this.getTheme());
    }

    set color(color: string) {
        const oldTheme = this.getTheme();
        this._color = color;
        this.overlayContainer.getContainerElement().classList.replace(oldTheme, this.getTheme());
    }

    get isDarkTheme(): boolean {
        return this._isDarkTheme;
    }
}
