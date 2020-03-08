import { Injectable } from '@angular/core';

const gridSizeVariation = 5;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridSize = 50;
    isDisplayed = false;

    toggleGrid(): void {
        this.isDisplayed = !this.isDisplayed;
    }

    raiseGridSize(): void {
        this.gridSize += gridSizeVariation;
    }

    lowerGridSize(): void {
        if (this.gridSize - gridSizeVariation > 0) {
            this.gridSize -= gridSizeVariation;
        }
    }
}
