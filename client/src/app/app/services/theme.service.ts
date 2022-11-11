import { OverlayContainer } from '@angular/cdk/overlay';
import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { BackgroundPattern } from '@app/tools/enums/background-pattern';
import { Subscription } from 'rxjs';

const localStorageThemeColorKey = 'themeColor';
const localStorageThemeIsDarkKey = 'themeIsDark';
const localStorageBackgroundPattern = 'backgroundPattern';

@Injectable({
    providedIn: 'root',
})
export class ThemeService implements OnDestroy {
    _background: ElementRef<HTMLDivElement>; // tslint:disable-line: variable-name
    _backgroundPattern: BackgroundPattern = BackgroundPattern.Paper; // tslint:disable-line: variable-name

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
        const ratio = this.drawingService.zoomRatio;
        this.setBackgroundPattern(ratio);
        this.background.nativeElement.style.setProperty('opacity', '1');
        this.background.nativeElement.style.setProperty(
            'background-position-x',
            `${this.drawingService.translation.x + window.innerWidth / 2}px`
        );
        this.background.nativeElement.style.setProperty(
            'background-position-y',
            `${this.drawingService.translation.y + window.innerHeight / 2}px`
        );
    }

    refreshBackgroundPattern(): void {
        // Forces to reload the canvas view
        this.drawingService.translation = this.drawingService.translation;
    }

    set background(background: ElementRef<HTMLDivElement>) {
        this._background = background;
        this.applyBackground();
    }

    get background(): ElementRef<HTMLDivElement> {
        return this._background;
    }

    get backgroundPattern(): BackgroundPattern {
        return this._backgroundPattern;
    }

    set backgroundPattern(pattern: BackgroundPattern) {
        this._backgroundPattern = pattern;
        this.saveSettingsToStorage();
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

        const backgroundPatternString = localStorage.getItem(localStorageBackgroundPattern);
        if (backgroundPatternString !== null) {
            this._backgroundPattern = +backgroundPatternString;
        }
    }

    private saveSettingsToStorage(): void {
        localStorage.setItem(localStorageThemeColorKey, this.color);
        localStorage.setItem(localStorageThemeIsDarkKey, JSON.stringify(this._isDarkTheme));
        localStorage.setItem(localStorageBackgroundPattern, JSON.stringify(this.backgroundPattern));
    }

    private setBackgroundPattern(ratio: number): void {
        // tslint:disable: no-magic-numbers
        const color = this.isDarkTheme ? '#454545' : '#dbdbdb';
        switch (this._backgroundPattern) {
            case BackgroundPattern.None:
                this.background.nativeElement.style.setProperty('background-image', 'none');
                this.background.nativeElement.style.setProperty('background-size', 'none');
                break;
            case BackgroundPattern.Paper:
                this.background.nativeElement.style.setProperty(
                    'background-image',
                    `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px), linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`
                );
                this.background.nativeElement.style.setProperty(
                    'background-size',
                    `${100 * ratio}px ${100 * ratio}px, ${100 * ratio}px ${100 * ratio}px, ${20 * ratio}px ${
                        20 * ratio
                    }px, ${20 * ratio}px ${20 * ratio}px`
                );
                break;
            case BackgroundPattern.Boxes:
                this.background.nativeElement.style.setProperty(
                    'background-image',
                    `linear-gradient(${color} 1px, transparent 1px), linear-gradient(to right, ${color} 1px, transparent 1px)`
                );
                this.background.nativeElement.style.setProperty('background-size', `${20 * ratio}px ${20 * ratio}px`);
                break;
            case BackgroundPattern.Polka:
                this.background.nativeElement.style.setProperty(
                    'background-image',
                    `radial-gradient(${color} ${1 * ratio}px, transparent ${1 * ratio}px)`
                );
                this.background.nativeElement.style.setProperty('background-size', `${10 * ratio}px ${10 * ratio}px`);
                break;
            case BackgroundPattern.Checkered:
                this.background.nativeElement.style.setProperty(
                    'background',
                    `linear-gradient(135deg, ${color} 25%, transparent 25%),linear-gradient(225deg, ${color} 25%, transparent 25%),linear-gradient(315deg, ${color} 25%, transparent 25%),linear-gradient(45deg, ${color} 25%, transparent 25%)`
                );
                this.background.nativeElement.style.setProperty('background-size', `${3 * ratio}em ${3 * ratio}em`);
        }
        // tslint:enable: no-magic-numbers
    }
}
