import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';

const defaultDimensions: Vec2 = { x: 1024, y: 1024 };

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    renderer: Renderer2;

    private _drawingRoot: SVGSVGElement; // tslint:disable-line: variable-name
    get drawingRoot(): SVGSVGElement {
        return this._drawingRoot;
    }

    private svgDrawingContent: SVGGElement;

    title = 'Sans titre';
    labels: string[] = [];
    dimensions: Vec2 = defaultDimensions;
    backgroundColor: Color = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    private _svgElements: SVGElement[] = []; // tslint:disable-line: variable-name
    get svgElements(): SVGElement[] {
        return this._svgElements;
    }

    setTarget(drawingRoot: SVGSVGElement): void {
        this._drawingRoot = drawingRoot;
        this.svgDrawingContent = drawingRoot.getElementsByTagName('g')[0];
    }

    addElement(element: SVGElement): void {
        this.svgElements.push(element);
        this.renderer.appendChild(this.svgDrawingContent, element);
    }

    removeElement(element: SVGElement): void {
        const elementToRemoveIndex = this.svgElements.indexOf(element);
        if (elementToRemoveIndex > -1) {
            this.svgElements.splice(elementToRemoveIndex, 1);
            this.renderer.removeChild(this.svgDrawingContent, element);
        }
    }

    reappendStoredElements(): void {
        for (const element of this.svgElements) {
            this.addElement(element);
        }
    }

    clearStoredElements(): void {
        for (const element of this.svgElements) {
            this.renderer.removeChild(this.svgDrawingContent, element);
        }
    }

    isDrawingStarted(): boolean {
        return this.svgElements.length > 0;
    }
}
