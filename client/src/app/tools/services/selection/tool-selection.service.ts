import { Injectable, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GeometryService } from '@app/drawing/services/geometry.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolIcon } from '@app/tools/enums/tool-icon.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
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
    private isMouseDownInsideDrawing: boolean;
    private currentMouseButtonDown?: MouseButton = undefined;
    private hasUserJustClickedOnShape = false;
    private controlPointHeld = ControlPoints.None;
    private lastMousePosition: Vec2 = { x: 0, y: 0 };
    private isMouseButtonDown = false;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        private toolSelectionMoverService: ToolSelectionMoverService,
        private toolSelectionStateService: ToolSelectionStateService,
        private svgUtilityService: SvgUtilityService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolName.Selection, ToolIcon.Selection);
    }

    afterDrawingInit(): void {
        this.toolSelectionStateService.svgSelectedShapesRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.toolSelectionStateService.svgSelectedShapesRect, 'stroke-width', '2');
        this.renderer.setAttribute(this.toolSelectionStateService.svgSelectedShapesRect, 'stroke', '#000000');
        this.renderer.setAttribute(this.toolSelectionStateService.svgSelectedShapesRect, 'fill', 'none');
        this.renderer.setAttribute(this.toolSelectionStateService.svgSelectedShapesRect, 'display', 'none');

        const borderColor = Color.fromRgb(49, 104, 142); // tslint:disable-line: no-magic-numbers
        this.toolSelectionStateService.svgUserSelectionRect = this.svgUtilityService.createDashedRectBorder(borderColor);
        this.renderer.setAttribute(this.toolSelectionStateService.svgUserSelectionRect, 'display', 'none');

        this.drawingService.addUiElement(this.toolSelectionStateService.svgSelectedShapesRect);
        this.drawingService.addUiElement(this.toolSelectionStateService.svgUserSelectionRect);

        const controlPointsCount = 4;
        for (let i = 0; i < controlPointsCount; i++) {
            this.toolSelectionStateService.svgControlPoints.push(this.renderer.createElement('rect', 'svg'));
            this.renderer.setAttribute(this.toolSelectionStateService.svgControlPoints[i], 'width', controlPointSideSize.toString());
            this.renderer.setAttribute(this.toolSelectionStateService.svgControlPoints[i], 'height', controlPointSideSize.toString());
            this.renderer.setAttribute(this.toolSelectionStateService.svgControlPoints[i], 'fill', 'black');
            this.renderer.setAttribute(this.toolSelectionStateService.svgControlPoints[i], 'display', 'none');
            this.renderer.setAttribute(this.toolSelectionStateService.svgControlPoints[i], 'pointer-events', 'auto');
            this.drawingService.addUiElement(this.toolSelectionStateService.svgControlPoints[i]);

            this.renderer.listen(this.toolSelectionStateService.svgControlPoints[i], 'mousedown', (event: MouseEvent) => {
                this.controlPointHeld = i;
            });
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.controlPointHeld !== ControlPoints.None || this.toolSelectionStateService.isMovingSelectionWithArrows) {
            return;
        }
        if (this.isMouseButtonDown && this.isMouseDownInsideDrawing) {
            if (this.toolSelectionStateService.isMovingSelectionWithMouse) {
                const currentMousePos = this.getMousePosition(event);
                this.toolSelectionMoverService.moveSelection(currentMousePos, this.lastMousePosition);
                this.toolSelectionMoverService.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
            } else {
                const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.getMousePosition(event));
                this.updateVisibleRect(this.toolSelectionStateService.svgUserSelectionRect, userSelectionRect);
                if (this.currentMouseButtonDown === MouseButton.Left) {
                    this.toolSelectionStateService.selectedElements = this.svgUtilityService.getElementsUnderArea(
                        this.drawingService.svgElements,
                        userSelectionRect
                    );
                    this.toolSelectionMoverService.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
                } else if (this.currentMouseButtonDown === MouseButton.Right) {
                    const selectedElementsCopy = Object.assign([], this.toolSelectionStateService.selectedElements);
                    const currentSelectedElements = this.svgUtilityService.getElementsUnderArea(
                        this.drawingService.svgElements,
                        userSelectionRect
                    );
                    this.inverseObjectsSelection(currentSelectedElements, selectedElementsCopy);
                    this.toolSelectionMoverService.updateSvgSelectedShapesRect(selectedElementsCopy);
                }
            }
        }
        this.lastMousePosition = this.getMousePosition(event);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.controlPointHeld !== ControlPoints.None || this.toolSelectionStateService.isMovingSelectionWithArrows) {
            return;
        }

        this.isMouseDownInsideDrawing = Tool.isMouseInsideDrawing;
        this.userSelectionStartCoords = this.getMousePosition(event);
        if (Tool.isMouseInsideDrawing) {
            if (this.isMouseInsideSelection(this.getMousePosition(event)) && event.button === MouseButton.Left) {
                this.toolSelectionStateService.isMovingSelectionWithMouse = true;
                this.toolSelectionMoverService.totalSelectionMoveOffset = { x: 0, y: 0 };
            } else {
                const rect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.userSelectionStartCoords);
                this.updateVisibleRect(this.toolSelectionStateService.svgUserSelectionRect, rect);
            }
        } else {
            this.toolSelectionStateService.selectedElements = [];
            this.renderer.setAttribute(this.toolSelectionStateService.svgUserSelectionRect, 'display', 'none');
            this.hideSelectedShapesRect();
        }

        if (this.currentMouseButtonDown === undefined) {
            this.isMouseButtonDown = true;
            this.currentMouseButtonDown = event.button;
        }
        this.lastMousePosition = this.getMousePosition(event);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.controlPointHeld !== ControlPoints.None) {
            this.controlPointHeld = ControlPoints.None;
            return;
        }

        if (!this.toolSelectionStateService.isMovingSelectionWithMouse || this.isSimpleClick(event)) {
            this.updateSelectionOnMouseUp(event);
        }

        if (this.toolSelectionStateService.isMovingSelectionWithMouse) {
            this.toolSelectionMoverService.addMoveCommand();
        }

        if (event.button === this.currentMouseButtonDown) {
            this.isMouseButtonDown = false;
            this.currentMouseButtonDown = undefined;
        }

        this.hasUserJustClickedOnShape = false;
        this.toolSelectionStateService.isMovingSelectionWithMouse = false;
        this.lastMousePosition = this.getMousePosition(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'a' && event.ctrlKey) {
            this.toolSelectionStateService.selectedElements = [...this.drawingService.svgElements];
            this.toolSelectionMoverService.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
            return;
        }
        this.toolSelectionMoverService.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.toolSelectionMoverService.onKeyUp(event);
    }

    onElementClick(event: MouseEvent, element: SVGElement): void {
        this.hasUserJustClickedOnShape = true;
        if (this.toolSelectionStateService.isMovingSelectionWithMouse) {
            return;
        }
        if (event.button === MouseButton.Left && this.currentMouseButtonDown === event.button) {
            this.toolSelectionStateService.selectedElements = [element];
            this.toolSelectionMoverService.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
        } else if (event.button === MouseButton.Right && this.currentMouseButtonDown === event.button) {
            this.inverseObjectsSelection([element], this.toolSelectionStateService.selectedElements);
            this.toolSelectionMoverService.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
        }
    }

    onToolDeselection(): void {
        this.renderer.setAttribute(this.toolSelectionStateService.svgUserSelectionRect, 'display', 'none');
        this.toolSelectionStateService.selectedElements = [];
        this.toolSelectionStateService.selectionRect = undefined;
        this.hideSelectedShapesRect();
    }

    private isMouseInsideSelection(mousePosition: Vec2): boolean {
        if (this.toolSelectionStateService.selectionRect !== undefined) {
            return GeometryService.areRectsIntersecting(this.toolSelectionStateService.selectionRect, {
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
        this.renderer.setAttribute(this.toolSelectionStateService.svgUserSelectionRect, 'display', 'none');

        if (Tool.isMouseInsideDrawing && this.isMouseDownInsideDrawing) {
            const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.getMousePosition(event));
            const isSimpleClick = this.isSimpleClick(event);
            const isLeftButtonUp = event.button === MouseButton.Left && this.currentMouseButtonDown === event.button;
            const isRightButtonUp = this.currentMouseButtonDown === MouseButton.Right && this.currentMouseButtonDown === event.button;
            const currentSelectedElements = this.svgUtilityService.getElementsUnderArea(this.drawingService.svgElements, userSelectionRect);
            if (!isSimpleClick) {
                if (isLeftButtonUp) {
                    this.toolSelectionStateService.selectedElements = currentSelectedElements;
                    this.toolSelectionMoverService.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
                } else if (isRightButtonUp) {
                    this.inverseObjectsSelection(currentSelectedElements, this.toolSelectionStateService.selectedElements);
                    this.toolSelectionMoverService.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
                }
            } else if (!this.hasUserJustClickedOnShape && isLeftButtonUp) {
                this.toolSelectionStateService.selectedElements = [];
                this.toolSelectionMoverService.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
            }
        }
    }

    private updateVisibleRect(element: SVGRectElement, rect: Rect): void {
        this.svgUtilityService.updateSvgRectFromRect(element, rect);
        this.renderer.setAttribute(element, 'display', 'block');
    }

    private hideSelectedShapesRect(): void {
        this.toolSelectionStateService.selectionRect = undefined;
        this.toolSelectionMoverService.hideSvgSelectedShapesRect();
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
