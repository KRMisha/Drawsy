import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Drawing } from '@app/classes/drawing';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { SvgClickEvent } from '@app/drawing/classes/svg-click-event';
import { Subject } from 'rxjs';
import { GeometryService } from './geometry.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    private currentDrawing = new Drawing();
    private elementClickedSource = new Subject<SvgClickEvent>();
    private elementHoveredSource = new Subject<SVGElement>();

    elementClicked$ = this.elementClickedSource.asObservable();
    elementHovered$ = this.elementHoveredSource.asObservable();

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
        this.renderer.listen(element, 'mousemove', (event: MouseEvent) => {
            this.elementHoveredSource.next(element);
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

    getElementsUnderPoint(point: Vec2): SVGElement[] {
        return this.getElementsUnderArea({ x: point.x, y: point.y, width: 0, height: 0 });
    }

    getElementsUnderArea(area: Rect): SVGElement[] {
        const allSvgElements = this.getSvgElements();
        const selectedElements: SVGElement[] = [];
        for (let i = allSvgElements.length - 1; i >= 0; i--) {
            if (GeometryService.areRectsIntersecting(area, this.getSvgElementBounds(allSvgElements[i]))) {
                selectedElements.push(allSvgElements[i]);
            }
        }
        return selectedElements;
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

    getSvgElementBounds(svgElement: SVGElement): Rect {
        const svgElementBounds = svgElement.getBoundingClientRect() as DOMRect;
        const rootBounds = this.svgDrawingSurface.getBoundingClientRect() as DOMRect;

        return {
            x: svgElementBounds.x - rootBounds.x,
            y: svgElementBounds.y - rootBounds.y,
            width: svgElementBounds.width,
            height: svgElementBounds.height,
        } as Rect;
    }

    getSvgElementsBounds(svgElements: SVGElement[]): Rect | null {
        if (svgElements.length === 0) {
            return null;
        }
        const firstShapeRect = this.getSvgElementBounds(svgElements[0]);
        const minPos = { x: firstShapeRect.x, y: firstShapeRect.y };
        const maxPos = { x: firstShapeRect.x + firstShapeRect.width, y: firstShapeRect.y + firstShapeRect.height };

        for (const svgElement of svgElements) {
            const currentShapeRect = this.getSvgElementBounds(svgElement);
            minPos.x = Math.min(minPos.x, currentShapeRect.x);
            minPos.y = Math.min(minPos.y, currentShapeRect.y);
            maxPos.x = Math.max(maxPos.x, currentShapeRect.x + currentShapeRect.width);
            maxPos.y = Math.max(maxPos.y, currentShapeRect.y + currentShapeRect.height);
        }
        return { x: minPos.x, y: minPos.y, width: maxPos.x - minPos.x, height: maxPos.y - minPos.y } as Rect;
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
