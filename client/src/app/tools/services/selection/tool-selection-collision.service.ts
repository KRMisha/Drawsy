import { Injectable } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionCollisionService {
    constructor(private drawingService: DrawingService) {}

    isPointInRect(point: Vec2, rect: Rect): boolean {
        const isHorizIntersecting = point.x >= rect.x && point.x <= rect.x + rect.width;
        const isVertIntersecting = point.y >= rect.y && point.y <= rect.y + rect.height;
        return isHorizIntersecting && isVertIntersecting;
    }

    areRectsIntersecting(rect1: Rect, rect2: Rect): boolean {
        const isHorizIntersecting = rect1.x + rect1.width >= rect2.x && rect1.x <= rect2.x + rect2.width;
        const isVertIntersecting = rect1.y + rect1.height >= rect2.y && rect1.y <= rect2.y + rect2.height;
        return isHorizIntersecting && isVertIntersecting;
    }

    getElementsUnderArea(area: Rect): SVGGraphicsElement[] {
        return this.drawingService.svgElements.filter((element: SVGGraphicsElement) =>
            this.areRectsIntersecting(area, this.getElementBounds(element))
        );
    }

    getElementBounds(element: SVGGraphicsElement): Rect {
        const elementBounds = element.getBoundingClientRect() as DOMRect;
        const drawingRootBounds = this.drawingService.drawingRoot.getBoundingClientRect() as DOMRect;

        const paddingString = element.getAttribute('data-padding');
        const padding = paddingString === null ? 0 : +paddingString;

        return {
            x: elementBounds.left - drawingRootBounds.x - padding,
            y: elementBounds.top - drawingRootBounds.y - padding,
            width: elementBounds.right - elementBounds.left + 2 * padding,
            height: elementBounds.bottom - elementBounds.top + 2 * padding,
        } as Rect;
    }

    getElementListBounds(elements: SVGGraphicsElement[]): Rect | undefined {
        if (elements.length === 0) {
            return undefined;
        }

        const minPos = { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY };
        const maxPos = { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY };
        for (const element of elements) {
            const currentElementBounds = this.getElementBounds(element);
            minPos.x = Math.min(minPos.x, currentElementBounds.x);
            minPos.y = Math.min(minPos.y, currentElementBounds.y);
            maxPos.x = Math.max(maxPos.x, currentElementBounds.x + currentElementBounds.width);
            maxPos.y = Math.max(maxPos.y, currentElementBounds.y + currentElementBounds.height);
        }

        return { x: minPos.x, y: minPos.y, width: maxPos.x - minPos.x, height: maxPos.y - minPos.y } as Rect;
    }
}
