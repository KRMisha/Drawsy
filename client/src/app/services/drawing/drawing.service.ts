import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '../../classes/color/color';
import { Vec2 } from '../../classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    renderer: Renderer2;
    rootElement: SVGElement;

    drawingDimensions: Vec2 = { x: 512, y: 512 };
    backgroundColor = new Color();
    isDrawingStarted = false;

    private elements: SVGElement[] = [];

    constructor() {
        this.backgroundColor.red = 255;
        this.backgroundColor.green = 255;
        this.backgroundColor.blue = 255;
    }

    addElement(element: SVGElement): void {
        this.isDrawingStarted = true;
        this.elements.push(element);
        this.renderer.appendChild(this.rootElement, element);
    }

    removeElement(element: SVGElement): void {
        const elementToRemoveIndex = this.elements.indexOf(element, 0);
        if (elementToRemoveIndex > -1) {
            this.elements.splice(elementToRemoveIndex, 1);
            this.renderer.removeChild(this.rootElement, element);
        }
    }

    reappendStoredElements(): void {
        if (this.elements.length > 0) {
            this.isDrawingStarted = true;
        }
        for (const element of this.elements) {
            this.renderer.appendChild(this.rootElement, element);
        }
    }

    clearStoredElements(): void {
        this.isDrawingStarted = false;
        while (this.elements.length > 0) {
            this.renderer.removeChild(this.rootElement, this.elements.pop());
        }
    }
}
