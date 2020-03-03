import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Drawing } from '@app/classes/drawing';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    renderer: Renderer2;
    rootElement: SVGElement;
    svgDrawingSurface: SVGElement;
    svgSelectionShape: SVGElement;

    private currentDrawing = new Drawing();

    addElement(element: SVGElement): void {
        this.currentDrawing.addElement(element);
        this.renderer.appendChild(this.rootElement, element);
    }

    removeElement(element: SVGElement): void {
        if (this.currentDrawing.removeElement(element)) {
            this.renderer.removeChild(this.rootElement, element);
        }
    }

    reappendStoredElements(): void {
        for (const element of this.currentDrawing.elements) {
            this.renderer.appendChild(this.rootElement, element);
        }
    }

    clearStoredElements(): void {
        for (const element of this.currentDrawing.elements) {
            this.renderer.removeChild(this.rootElement, element);
        }
        this.currentDrawing.clearElements();
    }

    isDrawingStarted(): boolean {
        return this.currentDrawing.hasElements();
    }

    getDrawingDimensions(): Vec2 {
        return this.currentDrawing.dimensions;
    }

    getBackgroundColor(): Color {
        return this.currentDrawing.backgroundColor;
    }

    getSvgElements(): SVGElement[] {
        return this.currentDrawing.elements;
    }

    setDrawingDimensions(dimensions: Vec2): void {
        this.currentDrawing.dimensions = dimensions;
    }

    setBackgroundColor(color: Color): void {
        this.currentDrawing.backgroundColor = color;
    }
}
