import { Injectable } from '@angular/core';

const gridSizeVariation = 5;
const opacityRange = 100;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridSize = 100;
    opacity = 1;
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
        this.gridPathElement.setAttribute('d', `M ${this.gridSize} 0 L 0 0 0 ${this.gridSize}`);
        this.gridPatternElement.setAttribute('width', this.gridSize.toString());
        this.gridPatternElement.setAttribute('height', this.gridSize.toString());
        this.gridPathElement.setAttribute('fill-opacity', '0.1');
    }

    updateOpacity(opacity: number): void {
        this.opacity = opacity / opacityRange;
        this.gridPatternElement.setAttribute('stroke-opacity', `${this.opacity}`);
    }
}
