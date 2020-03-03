import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    private userSelectionStartCoords: Vec2;
    private isMouseDownInside: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService, ToolNames.Selection);
    }

    onMouseDown(event: MouseEvent): void {
        this.renderer.setAttribute(this.drawingService.svgSelectedShapesRect, 'display', 'none');
        this.isMouseDown = true;
        if (this.isMouseInside) {
            this.userSelectionStartCoords = { x: event.offsetX, y: event.offsetY } as Vec2;
            this.updateVisibleRect(this.getUserSelectionRect(event), this.drawingService.svgUserSelectionRect);
            this.renderer.setAttribute(this.drawingService.svgUserSelectionRect, 'display', 'block');
        }
        this.isMouseDownInside = this.isMouseInside;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isMouseDown && this.isMouseInside && this.isMouseDownInside) {
            const userSelectionRect = this.getUserSelectionRect(event);
            this.updateVisibleRect(userSelectionRect, this.drawingService.svgUserSelectionRect);
            const elementsBounds = this.getSvgElementsBounds(this.getSelectedElements(userSelectionRect));
            if (elementsBounds !== null) {
                this.renderer.setAttribute(this.drawingService.svgSelectedShapesRect, 'display', 'block');
                this.updateVisibleRect(elementsBounds, this.drawingService.svgSelectedShapesRect);
            } else {
                this.renderer.setAttribute(this.drawingService.svgSelectedShapesRect, 'display', 'none');
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.isMouseInside && this.isMouseDownInside) {
            const userSelectionRect = this.getUserSelectionRect(event);

            if (userSelectionRect.width !== 0 || userSelectionRect.height !== 0) {
                const selectedElements = this.getSelectedElements(userSelectionRect);
                const elementsBounds = this.getSvgElementsBounds(selectedElements);
                if (elementsBounds !== null) {
                    this.updateVisibleRect(elementsBounds, this.drawingService.svgSelectedShapesRect);
                }
            }
        }
        this.renderer.setAttribute(this.drawingService.svgUserSelectionRect, 'display', 'none');
    }

    onElementClick(element: SVGElement): void {
        const bounds = this.getSvgElementBounds(element);
        this.updateVisibleRect(bounds, this.drawingService.svgSelectedShapesRect);
    }

    private updateVisibleRect(area: Rect, rect: SVGElement): void {
        this.renderer.setAttribute(rect, 'x', area.x.toString());
        this.renderer.setAttribute(rect, 'y', area.y.toString());
        this.renderer.setAttribute(rect, 'width', area.width.toString());
        this.renderer.setAttribute(rect, 'height', area.height.toString());
        this.renderer.setAttribute(rect, 'display', 'block');
    }

    private getUserSelectionRect(event: MouseEvent): Rect {
        const userSelectionRect = new Rect();

        if (event.offsetX >= this.userSelectionStartCoords.x) {
            userSelectionRect.x = this.userSelectionStartCoords.x;
        } else {
            userSelectionRect.x = event.offsetX;
        }
        userSelectionRect.width = Math.abs(event.offsetX - this.userSelectionStartCoords.x);

        if (event.offsetY >= this.userSelectionStartCoords.y) {
            userSelectionRect.y = this.userSelectionStartCoords.y;
        } else {
            userSelectionRect.y = event.offsetY;
        }
        userSelectionRect.height = Math.abs(event.offsetY - this.userSelectionStartCoords.y);

        return userSelectionRect;
    }

    private getSelectedElements(area: Rect): SVGElement[] {
        const allSvgElements = this.drawingService.getSvgElements();
        const selectedElements: SVGElement[] = [];
        for (let i = allSvgElements.length - 1; i >= 0; i--) {
            if (this.isElementIntersectingSelection(area, this.getSvgElementBounds(allSvgElements[i]))) {
                selectedElements.push(allSvgElements[i]);
            }
        }
        return selectedElements;
    }

    private isElementIntersectingSelection(selectionRect: Rect, elementRect: Rect): boolean {
        return (
            selectionRect.x + selectionRect.width >= elementRect.x &&
            selectionRect.x <= elementRect.x + elementRect.width &&
            selectionRect.y + selectionRect.height >= elementRect.y &&
            selectionRect.y <= elementRect.y + elementRect.height
        );
    }

    private getSvgElementsBounds(svgElements: SVGElement[]): Rect | null {
        if (svgElements.length === 0) {
            return null;
        }
        const firstShapeRect = this.getSvgElementBounds(svgElements[0]);
        const minPos = { x: firstShapeRect.x, y: firstShapeRect.y };
        const maxPos = { x: firstShapeRect.x + firstShapeRect.width, y: firstShapeRect.y + firstShapeRect.height };

        for (const svgElement of svgElements) {
            const currentShapeRect = this.getSvgElementBounds(svgElement);
            if (currentShapeRect.x < minPos.x) {
                minPos.x = currentShapeRect.x;
            }
            if (currentShapeRect.y < minPos.y) {
                minPos.y = currentShapeRect.y;
            }
            if (currentShapeRect.x + currentShapeRect.width > maxPos.x) {
                maxPos.x = currentShapeRect.x + currentShapeRect.width;
            }
            if (currentShapeRect.y + currentShapeRect.height > maxPos.y) {
                maxPos.y = currentShapeRect.y + currentShapeRect.height;
            }
        }
        return { x: minPos.x, y: minPos.y, width: maxPos.x - minPos.x, height: maxPos.y - minPos.y } as Rect;
    }

    private getSvgElementBounds(svgElement: SVGElement): Rect {
        const svgElementBounds = svgElement.getBoundingClientRect() as DOMRect;
        const rootBounds = this.drawingService.svgDrawingSurface.getBoundingClientRect() as DOMRect;

        return {
            x: svgElementBounds.x - rootBounds.x,
            y: svgElementBounds.y - rootBounds.y,
            width: svgElementBounds.width,
            height: svgElementBounds.height,
        } as Rect;
    }
}
