import { OverlayContainer } from '@angular/cdk/overlay';
import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Subscription } from 'rxjs';

const localStorageThemeColorKey = 'themeColor';
const localStorageThemeIsDarkKey = 'themeIsDark';

@Injectable({
    providedIn: 'root',
})
export class ThemeService implements OnDestroy {
    _background: ElementRef<HTMLDivElement>; // tslint:disable-line: variable-name

    private zoomSubscription: Subscription;
    private translationSubscription: Subscription;

    private _color = 'blue'; // tslint:disable-line: variable-name
    private _isDarkTheme = true; // tslint:disable-line: variable-name

    constructor(private overlayContainer: OverlayContainer, private drawingService: DrawingService) {
        this.loadSettingsFromStorage();
        overlayContainer.getContainerElement().classList.add(this.theme);

        this.zoomSubscription = this.drawingService.zoomPercentChanged$.subscribe(() => {
            this.applyBackground();
        });
        this.translationSubscription = this.drawingService.translationChanged$.subscribe(() => {
            this.applyBackground();
        });
    }

    ngOnDestroy(): void {
        this.zoomSubscription.unsubscribe();
        this.translationSubscription.unsubscribe();
    }

    applyBackground(): void {
        const bigSquare = 100;
        const smallSquare = 20;
        const ratio = this.drawingService.zoomRatio;
        const color = this.isDarkTheme ? '#454545' : '#dbdbdb';
        this.background.nativeElement.style.setProperty('opacity', '1');
        this.background.nativeElement.style.setProperty(
            'background-image',
            `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px), linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`
        );
        this.background.nativeElement.style.setProperty(
            'background-size',
            `${bigSquare * ratio}px ${bigSquare * ratio}px, ${bigSquare * ratio}px ${bigSquare * ratio}px, ${smallSquare * ratio}px ${
                smallSquare * ratio
            }px, ${smallSquare * ratio}px ${smallSquare * ratio}px`
        );
        this.background.nativeElement.style.setProperty(
            'background-position-x',
            `${this.drawingService.translation.x + window.innerWidth / 2}px`
        );
        this.background.nativeElement.style.setProperty(
            'background-position-y',
            `${this.drawingService.translation.y + window.innerHeight / 2}px`
        );
    }

    set background(background: ElementRef<HTMLDivElement>) {
        this._background = background;
        this.applyBackground();
    }

    get background(): ElementRef<HTMLDivElement> {
        return this._background;
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
        this.applyBackground();
    }

    private loadSettingsFromStorage(): void {
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
