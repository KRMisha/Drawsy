import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GeometryService } from '@app/drawing/services/geometry.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { Tool } from '@app/tools/services/tool';

const controlPointSideSize = 10;

enum ControlPoints {
    None = -1,
    Left = 0,
    Top = 1,
    Right = 2,
    Bottom = 3,
}

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    private userSelectionStartCoords: Vec2;
    private isMouseDownInside: boolean;
    private selectedElements: SVGElement[] = [];
    private currentMouseButtonDown: ButtonId | null = null;
    private userJustClickedOnShape = false;
    private controlPointHeld = ControlPoints.None;

    private svgSelectedShapesRect: SVGElement;
    private svgUserSelectionRect: SVGElement;
    private svgControlPoints: SVGElement[] = [];

    constructor(drawingService: DrawingService) {
        super(drawingService, ToolNames.Selection);
    }

    afterDrawingInit(): void {
        this.svgSelectedShapesRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'stroke-width', '2');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'stroke', '#000000');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'fill', 'none');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'display', 'none');

        this.svgUserSelectionRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'fill', 'rgba(49, 104, 142, 0.2)');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-dasharray', '1, 7');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-width', '4');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke', 'rgba(49, 104, 142, 0.8)');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'display', 'none');

        this.drawingService.addUiElement(this.svgSelectedShapesRect);
        this.drawingService.addUiElement(this.svgUserSelectionRect);

        const controlPointsCount = 4;
        for (let i = 0; i < controlPointsCount; i++) {
            this.svgControlPoints.push(this.renderer.createElement('rect', 'svg'));
            this.renderer.setAttribute(this.svgControlPoints[this.svgControlPoints.length - 1], 'width', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[this.svgControlPoints.length - 1], 'height', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[this.svgControlPoints.length - 1], 'fill', 'black');
            this.renderer.setAttribute(this.svgControlPoints[this.svgControlPoints.length - 1], 'display', 'none');
            this.drawingService.addUiElement(this.svgControlPoints[this.svgControlPoints.length - 1]);

            this.renderer.listen(this.svgControlPoints[this.svgControlPoints.length - 1], 'mousedown', (event: MouseEvent) => {
                this.controlPointHeld = i;
            });
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (this.controlPointHeld !== ControlPoints.None) {
            return;
        }

        this.isMouseDown = true;
        this.isMouseDownInside = this.isMouseInside;
        this.userSelectionStartCoords = this.getMousePosition(event);
        if (this.isMouseInside) {
            const rect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.userSelectionStartCoords);
            this.updateVisibleRect(rect, this.svgUserSelectionRect);
        } else {
            this.renderer.setAttribute(this.svgUserSelectionRect, 'display', 'none');
            this.hideSelectedShapesRect();
        }

        if (this.currentMouseButtonDown === null) {
            this.currentMouseButtonDown = event.button;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.controlPointHeld !== ControlPoints.None) {
            return;
        }
        if (this.isMouseDown && this.isMouseInside && this.isMouseDownInside) {
            const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.getMousePosition(event));
            this.updateVisibleRect(userSelectionRect, this.svgUserSelectionRect);
            if (this.currentMouseButtonDown === ButtonId.Left) {
                this.selectedElements = this.drawingService.getElementsUnderArea(userSelectionRect);
                this.updateSvgSelectedShapesRect(this.selectedElements);
            } else if (this.currentMouseButtonDown === ButtonId.Right) {
                const selectedElementsCopy = Object.assign([], this.selectedElements);
                const currentSelectedElements = this.drawingService.getElementsUnderArea(userSelectionRect);
                this.inverseObjectsSelection(currentSelectedElements, selectedElementsCopy);
                this.updateSvgSelectedShapesRect(selectedElementsCopy);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.controlPointHeld !== ControlPoints.None) {
            this.controlPointHeld = ControlPoints.None;
            return;
        }
        this.isMouseDown = false;
        this.renderer.setAttribute(this.svgUserSelectionRect, 'display', 'none');

        if (this.isMouseInside && this.isMouseDownInside) {
            const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.getMousePosition(event));
            const currentSelectedElements = this.drawingService.getElementsUnderArea(userSelectionRect);

            const isSimpleClick = userSelectionRect.width === 0 && userSelectionRect.height === 0;
            const isLeftButtonUp = event.button === ButtonId.Left && this.currentMouseButtonDown === event.button;
            const isRightButtonUp = this.currentMouseButtonDown === ButtonId.Right && this.currentMouseButtonDown === event.button;

            if (!isSimpleClick) {
                if (isLeftButtonUp) {
                    this.selectedElements = currentSelectedElements;
                    this.updateSvgSelectedShapesRect(this.selectedElements);
                } else if (isRightButtonUp) {
                    this.inverseObjectsSelection(currentSelectedElements, this.selectedElements);
                    this.updateSvgSelectedShapesRect(this.selectedElements);
                }
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
        if (event.button === ButtonId.Left && this.currentMouseButtonDown === event.button) {
            this.selectedElements = [element];
            this.updateSvgSelectedShapesRect(this.selectedElements);
        } else if (event.button === ButtonId.Right && this.currentMouseButtonDown === event.button) {
            this.inverseObjectsSelection([element], this.selectedElements);
            this.updateSvgSelectedShapesRect(this.selectedElements);
        }
        this.userJustClickedOnShape = true;
    }

    private updateSvgSelectedShapesRect(selectedElements: SVGElement[]): void {
        const elementsBounds = this.drawingService.getElementListBounds(selectedElements);
        if (elementsBounds !== null) {
            this.updateVisibleRect(elementsBounds, this.svgSelectedShapesRect);
            const positions = [
                { x: elementsBounds.x, y: elementsBounds.y + elementsBounds.height / 2 } as Vec2,
                { x: elementsBounds.x + elementsBounds.width / 2, y: elementsBounds.y } as Vec2,
                { x: elementsBounds.x + elementsBounds.width, y: elementsBounds.y + elementsBounds.height / 2 } as Vec2,
                { x: elementsBounds.x + elementsBounds.width / 2, y: elementsBounds.y + elementsBounds.height } as Vec2,
            ];
            for (let i = 0; i < positions.length; i++) {
                this.renderer.setAttribute(this.svgControlPoints[i], 'x', (positions[i].x - controlPointSideSize / 2).toString());
                this.renderer.setAttribute(this.svgControlPoints[i], 'y', (positions[i].y - controlPointSideSize / 2).toString());
                this.renderer.setAttribute(this.svgControlPoints[i], 'display', 'block');
            }
        } else {
            this.hideSelectedShapesRect();
        }
    }

    private updateVisibleRect(area: Rect, rect: SVGElement): void {
        this.renderer.setAttribute(rect, 'x', area.x.toString());
        this.renderer.setAttribute(rect, 'y', area.y.toString());
        this.renderer.setAttribute(rect, 'width', area.width.toString());
        this.renderer.setAttribute(rect, 'height', area.height.toString());
        this.renderer.setAttribute(rect, 'display', 'block');
    }

    private hideSelectedShapesRect(): void {
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'display', 'none');
        for (const controlPoint of this.svgControlPoints) {
            this.renderer.setAttribute(controlPoint, 'display', 'none');
        }
    }

    private inverseObjectsSelection(svgElements: SVGElement[], array: SVGElement[]): void {
        for (const svgElement of svgElements) {
            const elementToRemoveIndex = array.indexOf(svgElement, 0);
            if (elementToRemoveIndex > -1) {
                array.splice(elementToRemoveIndex, 1);
            } else {
                array.push(svgElement);
            }
        }
    }
}
