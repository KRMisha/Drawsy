import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Drawing } from '@app/classes/drawing';
import { Vec2 } from '@app/classes/vec2';
import { DrawingPreviewTextures } from '@app/drawing/enums/drawing-preview-textures.enum';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    renderer: Renderer2;

    private drawingRoot: SVGSVGElement;
    private svgDrawingContent: SVGGElement;
    private svgDescContent: SVGDescElement;

    private currentDrawing = new Drawing();

    setTarget(drawingRoot: SVGSVGElement): void {
        this.drawingRoot = drawingRoot;
        this.svgDrawingContent = drawingRoot.getElementsByTagName('g')[0];
        this.svgDescContent = drawingRoot.getElementsByTagName('desc')[0];
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
        this.setBackgroundColor(drawing.backgroundColor);
    }

    addDescElements(elements: string[]): void {
        this.currentDrawing.addDescElement(elements);
        for (const element of elements) {
            this.svgDescContent.append(element);
        }
    }

    removeDescElement(element: string): void {
        this.currentDrawing.removeDescElement(element);
        // TODO: REMOVE STRING FROM DESC
    }

    getSvgRoot(): HTMLCollectionOf<SVGGElement> {
        return this.drawingRoot.getElementsByTagName('g');
    }

    getDrawingRoot(): SVGSVGElement {
        return this.drawingRoot;
    }

    setPreviewTexture(previewTexture: DrawingPreviewTextures): void {
        if (previewTexture === DrawingPreviewTextures.PreviewTexture0) {
            this.renderer.removeAttribute(this.svgDrawingContent, 'filter');
        } else {
            this.renderer.setAttribute(this.svgDrawingContent, 'filter', `url(#previewTexture${previewTexture})`);
        }
    }

    removePreviewTexture(): void {
        this.renderer.removeAttribute(this.svgDrawingContent, 'filter');
    }
}
