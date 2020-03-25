import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    readonly gridSizeVariation = 5;
    readonly minimumSize = 10;
    readonly maximumSize = 250;
    readonly minimumOpacity = 0.1;
    readonly maximumOpacity = 1;

    isDisplayEnabled = false;

    private _size = 100; // tslint:disable-line: variable-name
    private _opacity = 1; // tslint:disable-line: variable-name

    toggleDisplay(): void {
        this.isDisplayEnabled = !this.isDisplayEnabled;
    }

    increaseSize(): void {
        this.size = Math.min(
            Math.floor((this.size + this.gridSizeVariation) / this.gridSizeVariation) * this.gridSizeVariation,
            this.maximumSize
        );
    }

    decreaseSize(): void {
        this.size = Math.max(
            Math.ceil((this.size - this.gridSizeVariation) / this.gridSizeVariation) * this.gridSizeVariation,
            this.minimumSize
        );
    }

    get size(): number {
        return this._size;
    }

    set size(size: number) {
        this._size = Math.min(Math.max(size, this.minimumSize), this.maximumSize);
    }

    get opacity(): number {
        return this._opacity;
    }

    set opacity(size: number) {
        this._opacity = Math.min(Math.max(size, this.minimumOpacity), this.maximumOpacity);
    }
}
