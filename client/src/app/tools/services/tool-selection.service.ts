import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    private userSelectionStartCoords: Vec2;
    private isMouseDownInside: boolean;
    private selectedElements: SVGElement[] = [];
    private currentMouseButtonDown: ButtonId | null = null;
    private userJustClickedOnShape = false;

    constructor(drawingService: DrawingService) {
        super(drawingService, ToolNames.Selection);
    }

    onMouseDown(event: MouseEvent): void {
        // this.renderer.setAttribute(this.drawingService.svgSelectedShapesRect, 'display', 'none');
        this.isMouseDown = true;
        this.userSelectionStartCoords = this.getMousePosition(event);
        if (this.isMouseInside) {
            this.updateVisibleRect(this.getUserSelectionRect(this.userSelectionStartCoords), this.drawingService.svgUserSelectionRect);
            this.renderer.setAttribute(this.drawingService.svgUserSelectionRect, 'display', 'block');
        }
        this.isMouseDownInside = this.isMouseInside;
        if (this.currentMouseButtonDown === null) {
            this.currentMouseButtonDown = event.button;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isMouseDown && this.isMouseInside && this.isMouseDownInside) {
            const userSelectionRect = this.getUserSelectionRect(this.getMousePosition(event));
            this.updateVisibleRect(userSelectionRect, this.drawingService.svgUserSelectionRect);
            if (this.currentMouseButtonDown === ButtonId.Left) {
                this.selectedElements = this.getSelectedElements(userSelectionRect);
                this.updateSvgSelectedShapesRect(this.selectedElements);
            } else if (this.currentMouseButtonDown === ButtonId.Right) {
                const selectedElementsCopy = Object.assign([], this.selectedElements);
                const currentSelectedElements = this.getSelectedElements(userSelectionRect);
                this.inserveObjectsSelection(currentSelectedElements, selectedElementsCopy);
                this.updateSvgSelectedShapesRect(selectedElementsCopy);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
        this.renderer.setAttribute(this.drawingService.svgUserSelectionRect, 'display', 'none');

        if (this.isMouseInside && this.isMouseDownInside) {
            const userSelectionRect = this.getUserSelectionRect(this.getMousePosition(event));
            const currentSelectedElements = this.getSelectedElements(userSelectionRect);

            const isSimpleClick = userSelectionRect.width === 0 && userSelectionRect.height === 0;
            const isLeftButtonUp = event.button === ButtonId.Left && this.currentMouseButtonDown === event.button;
            const isRightButtonUp = this.currentMouseButtonDown === ButtonId.Right && this.currentMouseButtonDown === event.button;
            const isCurrentSelectionEmpty = currentSelectedElements.length === 0;

            if (!isSimpleClick) {
                if (isLeftButtonUp) {
                    this.selectedElements = currentSelectedElements;
                    this.updateSvgSelectedShapesRect(this.selectedElements);
                } else if (isRightButtonUp) {
                    this.inserveObjectsSelection(currentSelectedElements, this.selectedElements);
                    this.updateSvgSelectedShapesRect(this.selectedElements);
                }
            } else if ((isCurrentSelectionEmpty && isLeftButtonUp)) {
                this.selectedElements = currentSelectedElements;
                this.updateSvgSelectedShapesRect(this.selectedElements);
            } else if (!this.userJustClickedOnShape && isLeftButtonUp) {
                this.selectedElements = [];
                this.updateSvgSelectedShapesRect(this.selectedElements);
            }
        }

        if (event.button === this.currentMouseButtonDown) {
            this.currentMouseButtonDown = null;
        }

        this.userJustClickedOnShape = false;
    }

    onElementClick(event: MouseEvent, element: SVGElement): void {
        if ((event.button === ButtonId.Left && this.currentMouseButtonDown === event.button)) {
            this.selectedElements = [element];
            const bounds = this.getSvgElementBounds(element);
            this.updateVisibleRect(bounds, this.drawingService.svgSelectedShapesRect);
        } else if (event.button === ButtonId.Right && this.currentMouseButtonDown === event.button) {
            this.inserveObjectsSelection([element], this.selectedElements);
            this.updateSvgSelectedShapesRect(this.selectedElements);
        }
        this.userJustClickedOnShape = true; 
    }
    
    private updateSvgSelectedShapesRect(selectedElements: SVGElement[]): void {
        const elementsBounds = this.getSvgElementsBounds(selectedElements);
        if (elementsBounds !== null) {
            this.updateVisibleRect(elementsBounds, this.drawingService.svgSelectedShapesRect);
        } else {
            this.renderer.setAttribute(this.drawingService.svgSelectedShapesRect, 'display', 'none');
        }
    }

    private inserveObjectsSelection(svgElements: SVGElement[], array: SVGElement[]): void {
        for (const svgElement of svgElements) {
            const elementToRemoveIndex = array.indexOf(svgElement, 0);
            if (elementToRemoveIndex > -1) {
                array.splice(elementToRemoveIndex, 1);
            } else {
                array.push(svgElement);
            }
        }
    }

    private updateVisibleRect(area: Rect, rect: SVGElement): void {
        this.renderer.setAttribute(rect, 'x', area.x.toString());
        this.renderer.setAttribute(rect, 'y', area.y.toString());
        this.renderer.setAttribute(rect, 'width', area.width.toString());
        this.renderer.setAttribute(rect, 'height', area.height.toString());
        this.renderer.setAttribute(rect, 'display', 'block');
    }

    private getUserSelectionRect(mousePos: Vec2): Rect {
        const userSelectionRect = new Rect();

        userSelectionRect.x = Math.min(mousePos.x, this.userSelectionStartCoords.x);
        userSelectionRect.width = Math.abs(mousePos.x - this.userSelectionStartCoords.x);

        userSelectionRect.y = Math.min(mousePos.y, this.userSelectionStartCoords.y);
        userSelectionRect.height = Math.abs(mousePos.y - this.userSelectionStartCoords.y);

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
            minPos.x = Math.min(minPos.x, currentShapeRect.x);
            minPos.y = Math.min(minPos.y, currentShapeRect.y);
            maxPos.x = Math.max(maxPos.x, currentShapeRect.x + currentShapeRect.width);
            maxPos.y = Math.max(maxPos.y, currentShapeRect.y + currentShapeRect.height);
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

    private getMousePosition(event: MouseEvent): Vec2 {
        const rootBounds = this.drawingService.svgDrawingSurface.getBoundingClientRect() as DOMRect;
        return {
            x: event.clientX - rootBounds.x,
            y: event.clientY - rootBounds.y,
        } as Vec2;
    }
}
