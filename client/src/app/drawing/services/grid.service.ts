import { Injectable } from '@angular/core';

const gridSizeVariation = 5;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridSize = 50;
    isDisplayed = false;
    private gridPatternElement: SVGPatternElement;
    private gridPathElement: SVGPathElement;

    setElementRoots(patternRoot: SVGPatternElement, pathRoot: SVGPathElement): void {
        this.gridPatternElement = patternRoot;
        this.gridPathElement = pathRoot;
    }

    toggleGrid(): void {
        this.isDisplayed = !this.isDisplayed;
        const visibility = this.isDisplayed ? 'visible' : 'hidden';
        this.gridPathElement.setAttribute('visibility', visibility);
    }

    raiseGridSize(): void {
        this.gridSize += gridSizeVariation;
        this.updateGridSize();
    }

    lowerGridSize(): void {
        if (this.gridSize - gridSizeVariation > 0) {
            this.gridSize -= gridSizeVariation;
            this.updateGridSize();
        }
    }

    private updateGridSize(): void {
        this.gridPathElement.setAttribute('d', `M ${this.gridSize} 0 L 0 0 0 100`);
        this.gridPatternElement.setAttribute('width', this.gridSize.toString());
        this.gridPatternElement.setAttribute('height', this.gridSize.toString());
    }
}
