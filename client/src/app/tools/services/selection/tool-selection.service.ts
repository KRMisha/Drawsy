import { Injectable, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GeometryService } from '@app/drawing/services/geometry.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolInfo from '@app/tools/constants/tool-info';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { Tool } from '@app/tools/services/tool';
import { ToolSelectionUiService } from './tool-selection-ui.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    private userSelectionStartCoords: Vec2;
    private isMouseDownInsideDrawing: boolean;
    private currentMouseButtonDown?: MouseButton = undefined;
    private lastMousePosition: Vec2 = { x: 0, y: 0 };
    private isMouseButtonDown = false;

    private hasUserJustClickedOnShape = false;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        private toolSelectionMoverService: ToolSelectionMoverService,
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionUiService: ToolSelectionUiService,
        private svgUtilityService: SvgUtilityService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolInfo.Selection);
    }

    onMouseMove(): void {
        if (!this.isMouseButtonDown || !this.isMouseDownInsideDrawing) {
            return;
        }

        if (this.toolSelectionStateService.isMovingSelectionWithMouse) {
            this.toolSelectionMoverService.moveSelection(Tool.mousePosition, this.lastMousePosition);
        } else {
            const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, Tool.mousePosition);
            this.svgUtilityService.updateSvgRectFromRect(this.toolSelectionUiService.svgUserSelectionRect, userSelectionRect);

            if (this.currentMouseButtonDown === MouseButton.Left) {
                this.toolSelectionStateService.selectedElements = this.svgUtilityService.getElementsUnderArea(
                    this.drawingService.svgElements,
                    userSelectionRect
                );
            } else if (this.currentMouseButtonDown === MouseButton.Right) {
                const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
                const currentSelectedElements = this.svgUtilityService.getElementsUnderArea(
                    this.drawingService.svgElements,
                    userSelectionRect
                );
                this.inverseObjectsSelection(currentSelectedElements, selectedElementsCopy);
            }
        }

        this.lastMousePosition = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
    }

    onMouseDown(event: MouseEvent): void {
        if (this.toolSelectionStateService.isMovingSelectionWithArrows || this.currentMouseButtonDown !== undefined) {
            return;
        }

        this.isMouseDownInsideDrawing = Tool.isMouseInsideDrawing;
        this.userSelectionStartCoords = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
        if (Tool.isMouseInsideDrawing) {
            if (this.isMouseInsideSelection(Tool.mousePosition) && event.button === MouseButton.Left) {
                this.drawingService.appendNewMatrixToElements(this.toolSelectionStateService.selectedElements);
                this.toolSelectionStateService.isMovingSelectionWithMouse = true;
                this.toolSelectionMoverService.totalSelectionMoveOffset = { x: 0, y: 0 };
            } else {
                this.drawingService.addUiElement(this.toolSelectionUiService.svgUserSelectionRect);
                const rect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, this.userSelectionStartCoords);
                this.svgUtilityService.updateSvgRectFromRect(this.toolSelectionUiService.svgUserSelectionRect, rect);
            }
        } else {
            this.toolSelectionStateService.selectedElements = [];
        }

        if (this.currentMouseButtonDown === undefined) {
            this.isMouseButtonDown = true;
            this.currentMouseButtonDown = event.button;
        }
        this.lastMousePosition = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button !== this.currentMouseButtonDown) {
            return;
        }

        this.drawingService.removeUiElement(this.toolSelectionUiService.svgUserSelectionRect);

        if (!this.toolSelectionStateService.isMovingSelectionWithMouse || this.isSimpleClick(event)) {
            this.updateSelectionOnMouseUp(event);
        }

        if (this.toolSelectionStateService.isMovingSelectionWithMouse) {
            this.toolSelectionMoverService.addMoveCommand();
            this.toolSelectionStateService.isMovingSelectionWithMouse = false;
        }

        if (event.button === this.currentMouseButtonDown) {
            this.isMouseButtonDown = false;
            this.currentMouseButtonDown = undefined;
        }

        this.isMouseButtonDown = false;
        this.currentMouseButtonDown = undefined;

        this.hasUserJustClickedOnShape = false;
        this.lastMousePosition = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'a') {
            this.toolSelectionStateService.selectedElements = [...this.drawingService.svgElements];
            return;
        }
        this.toolSelectionMoverService.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.toolSelectionMoverService.onKeyUp(event);
    }

    onElementClick(event: MouseEvent, element: SVGGraphicsElement): void {
        if (this.toolSelectionStateService.isMovingSelectionWithArrows) {
            return;
        }

        this.hasUserJustClickedOnShape = true;
        if (event.button === MouseButton.Left && this.currentMouseButtonDown === event.button) {
            this.toolSelectionStateService.selectedElements = [element];
        } else if (event.button === MouseButton.Right && this.currentMouseButtonDown === event.button) {
            this.inverseObjectsSelection([element], this.toolSelectionStateService.selectedElements);
        }
    }

    update(): void {
        const existingShapes = new Set(this.drawingService.svgElements);
        for (let i = this.toolSelectionStateService.selectedElements.length - 1; i >= 0; i--) {
            if (!existingShapes.has(this.toolSelectionStateService.selectedElements[i])) {
                this.toolSelectionStateService.selectedElements.splice(i, 1);
            }
        }
        this.toolSelectionUiService.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
    }

    onToolDeselection(): void {
        this.toolSelectionStateService.selectedElements = [];
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
        const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, Tool.mousePosition);
        return userSelectionRect.width === 0 && userSelectionRect.height === 0;
    }

    private updateSelectionOnMouseUp(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && this.isMouseDownInsideDrawing) {
            const isLeftButtonUp = event.button === MouseButton.Left && this.currentMouseButtonDown === event.button;
            const isRightButtonUp = this.currentMouseButtonDown === MouseButton.Right && this.currentMouseButtonDown === event.button;
            if (!this.isSimpleClick(event)) {
                const userSelectionRect = GeometryService.getRectFromPoints(this.userSelectionStartCoords, Tool.mousePosition);
                const currentSelectedElements = this.svgUtilityService.getElementsUnderArea(
                    this.drawingService.svgElements,
                    userSelectionRect
                );
                if (isLeftButtonUp) {
                    this.toolSelectionStateService.selectedElements = currentSelectedElements;
                } else if (isRightButtonUp) {
                    this.inverseObjectsSelection(currentSelectedElements, this.toolSelectionStateService.selectedElements);
                }
            } else if (!this.hasUserJustClickedOnShape && isLeftButtonUp) {
                this.toolSelectionStateService.selectedElements = [];
            }
        }
    }

    private inverseObjectsSelection(svgElementsToInverse: SVGGraphicsElement[], selection: SVGGraphicsElement[]): void {
        for (const svgElement of svgElementsToInverse) {
            const elementToRemoveIndex = selection.indexOf(svgElement, 0);
            if (elementToRemoveIndex !== -1) {
                selection.splice(elementToRemoveIndex, 1);
            } else {
                selection.push(svgElement);
            }
        }
        this.toolSelectionUiService.updateSvgSelectedShapesRect(selection);
    }
}
