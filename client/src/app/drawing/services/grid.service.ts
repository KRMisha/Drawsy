import { Injectable, OnDestroy } from '@angular/core';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { Subscription } from 'rxjs';

const gridSizeVariation = 5;

@Injectable({
    providedIn: 'root',
})
export class GridService implements OnDestroy {
    readonly minimumSize = 10;
    readonly maximumSize = 1000;
    readonly minimumOpacity = 0.1;
    readonly maximumOpacity = 1;

    private _isDisplayEnabled = false; // tslint:disable-line: variable-name
    private _size = 100; // tslint:disable-line: variable-name
    private _opacity = 1; // tslint:disable-line: variable-name

    private toggleGridSubscription: Subscription;
    private increaseGridSizeSubscription: Subscription;
    private decreaseGridSizeSubscription: Subscription;

    constructor(private shortcutService: ShortcutService) {
        this.toggleGridSubscription = this.shortcutService.toggleGrid$.subscribe(() => {
            this.toggleDisplay();
        });
        this.increaseGridSizeSubscription = this.shortcutService.increaseGridSize$.subscribe(() => {
            this.increaseSize();
        });
        this.decreaseGridSizeSubscription = this.shortcutService.decreaseGridSize$.subscribe(() => {
            this.decreaseSize();
        });
    }

    ngOnDestroy(): void {
        this.toggleGridSubscription.unsubscribe();
        this.increaseGridSizeSubscription.unsubscribe();
        this.decreaseGridSizeSubscription.unsubscribe();
    }

    get isDisplayEnabled(): boolean {
        return this._isDisplayEnabled;
    }

    toggleDisplay(): void {
        this._isDisplayEnabled = !this._isDisplayEnabled;
    }

    get size(): number {
        return this._size;
    }

    set size(size: number) {
        this._size = Math.min(Math.max(size, this.minimumSize), this.maximumSize);
    }

    increaseSize(): void {
        this.size = Math.min(Math.floor((this.size + gridSizeVariation) / gridSizeVariation) * gridSizeVariation, this.maximumSize);
    }

    decreaseSize(): void {
        this.size = Math.max(Math.ceil((this.size - gridSizeVariation) / gridSizeVariation) * gridSizeVariation, this.minimumSize);
    }

    get opacity(): number {
        return this._opacity;
    }

    set opacity(size: number) {
        this._opacity = Math.min(Math.max(size, this.minimumOpacity), this.maximumOpacity);
    }
}
