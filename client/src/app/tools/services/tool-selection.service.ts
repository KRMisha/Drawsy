import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { MoveElementsCommand } from '@app/drawing/classes/commands/move-elements-command';
import { CommandService } from '@app/drawing/services/command.service';
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
    private selectionRect: Rect | null = null;
    private isMovingSelection = false;
    private lastMousePosition: Vec2 = { x: 0, y: 0 };
    private totalMoveValue: Vec2 = { x: 0, y: 0 };

    private svgSelectedShapesRect: SVGRectElement;
    private svgUserSelectionRect: SVGRectElement;
    private svgControlPoints: SVGElement[] = [];

    private arrowUpHeld = false;
    private arrowDownHeld = false;
    private arrowLeftHeld = false;
    private arrowRightHeld = false;

    constructor(protected drawingService: DrawingService, private commandService: CommandService) {
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
            if (this.isMouseInsideSelection(this.getMousePosition(event)) && event.button === ButtonId.Left) {
                this.isMovingSelection = true;
                this.totalMoveValue = { x: 0, y: 0 };
            } else {
                const rect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.userSelectionStartCoords);
                this.updateVisibleRect(this.svgUserSelectionRect, rect);
            }
        } else {
            this.selectedElements = [];
            this.renderer.setAttribute(this.svgUserSelectionRect, 'display', 'none');
            this.hideSelectedShapesRect();
        }

        if (this.currentMouseButtonDown === null) {
            this.currentMouseButtonDown = event.button;
        }
        this.lastMousePosition = this.getMousePosition(event);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.controlPointHeld !== ControlPoints.None) {
            return;
        }
        if (this.isMouseDown && this.isMouseDownInside) {
            if (this.isMovingSelection) {
                const currentMousePos = this.getMousePosition(event);
                const deltaMousePos: Vec2 = {
                    x: currentMousePos.x - this.lastMousePosition.x,
                    y: currentMousePos.y - this.lastMousePosition.y,
                };
                this.totalMoveValue.x += deltaMousePos.x;
                this.totalMoveValue.y += deltaMousePos.y;

                this.drawingService.moveElementList(this.selectedElements, deltaMousePos);
                this.updateSvgSelectedShapesRect(this.selectedElements);
            } else {
                const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.getMousePosition(event));
                this.updateVisibleRect(this.svgUserSelectionRect, userSelectionRect);
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
        this.lastMousePosition = this.getMousePosition(event);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.controlPointHeld !== ControlPoints.None) {
            this.controlPointHeld = ControlPoints.None;
            return;
        }

        if (!this.isMovingSelection || this.isSimpleClick(event)) {
            this.updateSelectionOnMouseUp(event);
        }

        if (this.isMovingSelection) {
            this.addMoveCommand();
        }

        if (event.button === this.currentMouseButtonDown) {
            this.currentMouseButtonDown = null;
        }

        this.isMouseDown = false;
        this.userJustClickedOnShape = false;
        this.isMovingSelection = false;
        this.lastMousePosition = this.getMousePosition(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'a' && event.ctrlKey) {
            this.selectedElements = [...this.drawingService.svgElements];
            this.updateSvgSelectedShapesRect(this.selectedElements);
            return;
        }
        this.setArrowStateFromEvent(event, true);
        this.moveSelectionInArrowDirection();
    }

    onKeyUp(event: KeyboardEvent): void {
        this.setArrowStateFromEvent(event, false);
        if (
            !this.arrowDownHeld &&
            !this.arrowUpHeld &&
            !this.arrowLeftHeld &&
            !this.arrowRightHeld &&
            (this.totalMoveValue.x !== 0 || this.totalMoveValue.y !== 0)
        ) {
            this.addMoveCommand();
        }
    }

    onElementClick(event: MouseEvent, element: SVGElement): void {
        this.userJustClickedOnShape = true;
        if (this.isMovingSelection) {
            return;
        }
        if (event.button === ButtonId.Left && this.currentMouseButtonDown === event.button) {
            this.selectedElements = [element];
            this.updateSvgSelectedShapesRect(this.selectedElements);
        } else if (event.button === ButtonId.Right && this.currentMouseButtonDown === event.button) {
            this.inverseObjectsSelection([element], this.selectedElements);
            this.updateSvgSelectedShapesRect(this.selectedElements);
        }
    }

    onToolDeselection(): void {
        this.renderer.setAttribute(this.svgUserSelectionRect, 'display', 'none');
        this.selectedElements = [];
        this.selectionRect = null;
        this.hideSelectedShapesRect();
    }

    private addMoveCommand(): void {
        const selectedElementsCopy = [...this.selectedElements];
        this.commandService.addCommand(new MoveElementsCommand(this.drawingService, selectedElementsCopy, this.totalMoveValue));
        this.totalMoveValue = { x: 0, y: 0 };
    }

    private setArrowStateFromEvent(event: KeyboardEvent, state: boolean): void {
        switch (event.key) {
            case 'ArrowUp':
                this.arrowUpHeld = state;
                break;
            case 'ArrowDown':
                this.arrowDownHeld = state;
                break;
            case 'ArrowLeft':
                this.arrowLeftHeld = state;
                break;
            case 'ArrowRight':
                this.arrowRightHeld = state;
                break;
        }
    }

    private moveSelectionInArrowDirection(): void {
        const moveDirection: Vec2 = { x: 0, y: 0 };
        const moveDelta = 3;
        if (this.arrowLeftHeld !== this.arrowRightHeld) {
            moveDirection.x = this.arrowRightHeld ? moveDelta : -moveDelta;
        }
        if (this.arrowUpHeld !== this.arrowDownHeld) {
            moveDirection.y = this.arrowDownHeld ? moveDelta : -moveDelta;
        }

        this.totalMoveValue.x += moveDirection.x;
        this.totalMoveValue.y += moveDirection.y;

        this.drawingService.moveElementList(this.selectedElements, moveDirection);
        this.updateSvgSelectedShapesRect(this.selectedElements);
    }

    private isMouseInsideSelection(mousePosition: Vec2): boolean {
        if (this.selectionRect) {
            return GeometryService.areRectsIntersecting(this.selectionRect, {
                x: mousePosition.x,
                y: mousePosition.y,
                width: 0,
                height: 0,
            });
        }
        return false;
    }

    private isSimpleClick(event: MouseEvent): boolean {
        const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.getMousePosition(event));
        return userSelectionRect.width === 0 && userSelectionRect.height === 0;
    }

    private updateSelectionOnMouseUp(event: MouseEvent): void {
        this.renderer.setAttribute(this.svgUserSelectionRect, 'display', 'none');

        if (this.isMouseInside && this.isMouseDownInside) {
            const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.getMousePosition(event));

            const isSimpleClick = this.isSimpleClick(event);
            const isLeftButtonUp = event.button === ButtonId.Left && this.currentMouseButtonDown === event.button;
            const isRightButtonUp = this.currentMouseButtonDown === ButtonId.Right && this.currentMouseButtonDown === event.button;

            const currentSelectedElements = this.drawingService.getElementsUnderArea(userSelectionRect);
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
    }

    private updateSvgSelectedShapesRect(selectedElements: SVGElement[]): void {
        const elementsBounds = this.drawingService.getElementListBounds(selectedElements);
        if (elementsBounds !== null) {
            this.updateVisibleRect(this.svgSelectedShapesRect, elementsBounds);
            this.selectionRect = elementsBounds;
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

    private updateVisibleRect(element: SVGRectElement, rect: Rect): void {
        this.drawingService.updateSvgRectFromRect(element, rect);
        this.renderer.setAttribute(element, 'display', 'block');
    }

    private hideSelectedShapesRect(): void {
        this.selectionRect = null;
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
