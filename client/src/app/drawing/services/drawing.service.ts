import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Drawing } from '@app/classes/drawing';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    renderer: Renderer2;

    private drawingRoot: SVGSVGElement;
    private svgDrawingContent: SVGGElement;
    private svgMetadataContent: SVGMetadataElement;

    private currentDrawing = new Drawing();

    constructor() {
        this.currentDrawing.backgroundColor.red = Color.maxRgb;
        this.currentDrawing.backgroundColor.green = Color.maxRgb;
        this.currentDrawing.backgroundColor.blue = Color.maxRgb;
    }

    setTarget(drawingRoot: SVGSVGElement): void {
        this.drawingRoot = drawingRoot;
        this.svgDrawingContent = drawingRoot.getElementsByTagName('g')[0];
        this.svgMetadataContent = drawingRoot.getElementsByTagName('metadata')[0];
    }

    addElement(element: SVGElement): void {
        this.currentDrawing.addSvgElement(element);
        this.renderer.appendChild(this.svgDrawingContent, element);
    }

    removeElement(element: SVGElement): void {
        if (this.currentDrawing.removeSvgElement(element)) {
            this.renderer.removeChild(this.svgDrawingContent, element);
        }
    }

    reappendStoredElements(): void {
        for (const element of this.currentDrawing.svgElements) {
            this.renderer.appendChild(this.svgDrawingContent, element);
        }
    }

    clearStoredElements(): void {
        for (const element of this.currentDrawing.svgElements) {
            this.renderer.removeChild(this.svgDrawingContent, element);
        }
        this.currentDrawing.clearSvgElements();
    }

    isDrawingStarted(): boolean {
        return this.currentDrawing.hasSvgElements();
    }

    getDrawingDimensions(): Vec2 {
        return this.currentDrawing.dimensions;
    }

    getBackgroundColor(): Color {
        return this.currentDrawing.backgroundColor;
    }

    setDrawingDimensions(dimensions: Vec2): void {
        this.currentDrawing.dimensions = dimensions;
    }

    setBackgroundColor(color: Color): void {
        this.currentDrawing.backgroundColor = color;
    }

    getCurrentDrawing(): Drawing {
        return this.currentDrawing;
    }

    setDrawing(drawing: Drawing): void {
        this.clearStoredElements();
        this.currentDrawing = drawing;
        this.reappendStoredElements();
    }

    addSvgMetadataElement(element: SVGMetadataElement): void {
        this.currentDrawing.addmetadataElement(element);
        this.renderer.appendChild(this.svgMetadataContent, element);
    }

    getSvgRoot(): void {
        this.drawingRoot.getElementsByTagName('g');
    }
}
