import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';

export class Drawing {
    private _svgElements: SVGElement[] = []; // tslint:disable-line: variable-name
    get svgElements(): SVGElement[] {
        return this._svgElements;
    }

    private _metadataElements: SVGMetadataElement[] = []; // tslint:disable-line: variable-name
    get metadataElements(): SVGMetadataElement[] {
        return this._metadataElements;
    }

    dimensions: Vec2 = { x: 512, y: 512 };

    backgroundColor = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    addSvgElement(element: SVGElement): void {
        this.svgElements.push(element);
    }

    removeSvgElement(element: SVGElement): boolean {
        const elementToRemoveIndex = this.svgElements.indexOf(element, 0);
        if (elementToRemoveIndex > -1) {
            this.svgElements.splice(elementToRemoveIndex, 1);
            return true;
        }
        return false;
    }

    clearSvgElements(): void {
        this.svgElements.length = 0;
    }

    hasSvgElements(): boolean {
        return this.svgElements.length > 0;
    }

    addMetadataElement(element: SVGMetadataElement): void {
        this.metadataElements.push(element);
    }

    removeMetadataElement(element: SVGMetadataElement): boolean {
        const elementToRemoveIndex = this.metadataElements.indexOf(element, 0);
        if (elementToRemoveIndex > -1) {
            this.metadataElements.splice(elementToRemoveIndex, 1);
            return true;
        }
        return false;
    }

    clearMetadataSvgElements(): void {
        this.metadataElements.length = 0;
    }

    hasMetadataSvgElements(): boolean {
        return this.metadataElements.length > 0;
    }
}
