import { Injectable } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionCollisionService {
    constructor(private drawingService: DrawingService) {}

    areRectsIntersecting(rect1: Rect, rect2: Rect): boolean {
        const isHorizIntersecting = rect1.x + rect1.width >= rect2.x && rect1.x <= rect2.x + rect2.width;
        const isVertIntersecting = rect1.y + rect1.height >= rect2.y && rect1.y <= rect2.y + rect2.height;
        return isHorizIntersecting && isVertIntersecting;
    }

    getElementsUnderArea(elements: SVGGraphicsElement[], area: Rect): SVGGraphicsElement[] {
        return elements.filter((element: SVGGraphicsElement) => this.areRectsIntersecting(area, this.getElementBounds(element)));
    }

    getElementBounds(element: SVGGraphicsElement): Rect {
        const svgElementBounds = element.getBoundingClientRect() as DOMRect;
        const drawingRootBounds = this.drawingService.drawingRoot.getBoundingClientRect() as DOMRect;

        const paddingString = element.getAttribute('data-padding') || undefined;
        const paddingValue = paddingString === undefined ? 0 : +paddingString;

        return {
            x: svgElementBounds.x - drawingRootBounds.x - paddingValue,
            y: svgElementBounds.y - drawingRootBounds.y - paddingValue,
            width: svgElementBounds.width + 2 * paddingValue,
            height: svgElementBounds.height + 2 * paddingValue,
        } as Rect;
    }

    getElementListBounds(elements: SVGGraphicsElement[]): Rect | undefined {
        if (elements.length === 0) {
            return undefined;
        }

        const firstShapeBounds = this.getElementBounds(elements[0]);
        const minPos = { x: firstShapeBounds.x, y: firstShapeBounds.y };
        const maxPos = { x: firstShapeBounds.x + firstShapeBounds.width, y: firstShapeBounds.y + firstShapeBounds.height };

        for (const element of elements) {
            const currentShapeBounds = this.getElementBounds(element);
            minPos.x = Math.min(minPos.x, currentShapeBounds.x);
            minPos.y = Math.min(minPos.y, currentShapeBounds.y);
            maxPos.x = Math.max(maxPos.x, currentShapeBounds.x + currentShapeBounds.width);
            maxPos.y = Math.max(maxPos.y, currentShapeBounds.y + currentShapeBounds.height);
        }
        return { x: minPos.x, y: minPos.y, width: maxPos.x - minPos.x, height: maxPos.y - minPos.y } as Rect;
    }
}
