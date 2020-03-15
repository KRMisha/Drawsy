import { Injectable } from '@angular/core';

const maximumSize = 1000;
const minimumSize = 10;
const gridSizeVariation = 5;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridSize = 100;
    gridOpacity = 1;
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

    setGridSize(gridSize: number): void {
        this.gridSize = gridSize;
        this.updateGridSize();
    }

    increaseGridSize(): void {
        if (Math.floor(this.gridSize) + gridSizeVariation <= maximumSize) {
            const sizeModulo = this.gridSize % gridSizeVariation;
            this.gridSize = Math.floor(this.gridSize) + gridSizeVariation - sizeModulo;
            this.updateGridSize();
        }
    }

    decreaseGridSize(): void {
        if (this.gridSize - gridSizeVariation >= minimumSize) {
            const sizeModulo = this.gridSize % gridSizeVariation;
            sizeModulo === 0 ? (this.gridSize -= gridSizeVariation) : (this.gridSize -= sizeModulo);
            this.updateGridSize();
        }
    }

    private updateGridSize(): void {
        this.gridPathElement.setAttribute('d', `M ${this.gridSize} 0 L 0 0 0 ${this.gridSize}`);
        this.gridPatternElement.setAttribute('width', this.gridSize.toString());
        this.gridPatternElement.setAttribute('height', this.gridSize.toString());
    }

    updateOpacity(gridOpacity: number): void {
        this.gridOpacity = gridOpacity;
        this.gridPatternElement.setAttribute('stroke-opacity', `${this.gridOpacity}`);
    }
}
