import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';

export class Drawing {
    private _title: string; // tslint:disable-line: variable-name
    get title(): string {
        return this._title;
    }
    set title(title: string) {
        this.title = title;
    }

    private _svgElements: SVGElement[] = []; // tslint:disable-line: variable-name
    get svgElements(): SVGElement[] {
        return this._svgElements;
    }

    private _descElements: string[] = []; // tslint:disable-line: variable-name
    get descElements(): string[] {
        return this._descElements;
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

    addDescElement(element: string): void {
        this.descElements.push(element);
    }

    removeDescElement(element: string): boolean {
        const elementToRemoveIndex = this.descElements.indexOf(element, 0);
        if (elementToRemoveIndex > -1) {
            this.descElements.splice(elementToRemoveIndex, 1);
            return true;
        }
        return false;
    }

    clearDescSvgElements(): void {
        this.descElements.length = 0;
    }

    hasDescSvgElements(): boolean {
        return this.descElements.length > 0;
    }
}
