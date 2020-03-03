import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Drawing } from '@app/classes/drawing';
import { Vec2 } from '@app/classes/vec2';
import { SvgClickEvent } from '@app/drawing/classes/svg-click-event';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    private currentDrawing = new Drawing();
    private elementClickedSource = new Subject<SvgClickEvent>();

    elementClicked$ = this.elementClickedSource.asObservable();

    renderer: Renderer2;

    rootElement: SVGElement;
    svgUserInterfaceContent: SVGElement;
    svgDrawingSurface: SVGElement;

    addElement(element: SVGElement): void {
        this.currentDrawing.addElement(element);
        this.renderer.appendChild(this.rootElement, element);
        this.renderer.listen(element, 'mouseup', (event: MouseEvent) => {
            this.elementClickedSource.next({ svgElement: element, mouseEvent: event } as SvgClickEvent);
        });
    }

    removeElement(element: SVGElement): void {
        if (this.currentDrawing.removeElement(element)) {
            this.renderer.removeChild(this.rootElement, element);
        }
    }

    addUiElement(element: SVGElement): void {
        this.renderer.appendChild(this.svgUserInterfaceContent, element);
    }

    removeUiElement(element: SVGElement): void {
        this.renderer.removeChild(this.svgUserInterfaceContent, element);
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
