import { Injectable, OnDestroy, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GeometryService } from '@app/drawing/services/geometry.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import ToolInfo from '@app/tools/constants/tool-info';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionUiService } from '@app/tools/services/selection/tool-selection-ui.service';
import { Tool } from '@app/tools/services/tool';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool implements OnDestroy {
    private selectionOrigin: Vec2;
    private isMouseDownInsideDrawing: boolean;
    private currentMouseButtonDown?: MouseButton = undefined;
    private previousMousePosition: Vec2 = { x: 0, y: 0 };

    private hasUserJustClickedOnShape = false;

    private selectAllShortcutSubscription: Subscription;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        private toolSelectionMoverService: ToolSelectionMoverService,
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionUiService: ToolSelectionUiService,
        private svgUtilityService: SvgUtilityService,
        private shortcutService: ShortcutService
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Selection);
    }

    ngOnDestroy(): void {
        this.selectAllShortcutSubscription.unsubscribe();
    }

    onMouseMove(): void {
        const isMouseButtonInvalid = this.currentMouseButtonDown !== MouseButton.Left && this.currentMouseButtonDown !== MouseButton.Right;
        if (this.currentMouseButtonDown === undefined || !this.isMouseDownInsideDrawing || isMouseButtonInvalid) {
            return;
        }

        if (this.toolSelectionStateService.isMovingSelectionWithMouse) {
            this.toolSelectionMoverService.moveSelection(Tool.mousePosition, this.previousMousePosition);
        } else {
            const userSelectionRect = GeometryService.getRectFromPoints(this.selectionOrigin, Tool.mousePosition);
            this.svgUtilityService.updateSvgRectFromRect(this.toolSelectionUiService.svgUserSelectionRect, userSelectionRect);
            if (this.currentMouseButtonDown === MouseButton.Left) {
                this.toolSelectionStateService.selectedElements = this.svgUtilityService.getElementsUnderArea(
                    this.drawingService.svgElements,
                    userSelectionRect
                );
            } else {
                const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
                const currentSelectedElements = this.svgUtilityService.getElementsUnderArea(
                    this.drawingService.svgElements,
                    userSelectionRect
                );
                this.invertObjectsSelection(currentSelectedElements, selectedElementsCopy);
            }
        }

        this.previousMousePosition = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
    }

    onMouseDown(event: MouseEvent): void {
        if (this.toolSelectionStateService.isMovingSelectionWithArrows || this.currentMouseButtonDown !== undefined) {
            return;
        }

        this.isMouseDownInsideDrawing = Tool.isMouseInsideDrawing;
        this.selectionOrigin = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
        if (Tool.isMouseInsideDrawing) {
            if (this.isMouseInsideSelection(Tool.mousePosition) && event.button === MouseButton.Left) {
                this.drawingService.appendNewMatrixToElements(this.toolSelectionStateService.selectedElements);
                this.toolSelectionStateService.isMovingSelectionWithMouse = true;
                this.toolSelectionMoverService.totalSelectionMoveOffset = { x: 0, y: 0 };
            } else {
                this.drawingService.addUiElement(this.toolSelectionUiService.svgUserSelectionRect);
                const rect = GeometryService.getRectFromPoints(this.selectionOrigin, this.selectionOrigin);
                this.svgUtilityService.updateSvgRectFromRect(this.toolSelectionUiService.svgUserSelectionRect, rect);
            }
        } else {
            this.toolSelectionStateService.selectedElements = [];
        }

        this.currentMouseButtonDown = event.button;
        this.previousMousePosition = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button !== this.currentMouseButtonDown) {
            return;
        }

        this.drawingService.removeUiElement(this.toolSelectionUiService.svgUserSelectionRect);

        if (!this.toolSelectionStateService.isMovingSelectionWithMouse || this.isSingleClick()) {
            this.updateSelectionOnMouseUp(event);
        }

        if (this.toolSelectionStateService.isMovingSelectionWithMouse && !this.isSingleClick()) {
            this.toolSelectionMoverService.addMoveCommand();
        }

        this.currentMouseButtonDown = undefined;
        this.toolSelectionStateService.isMovingSelectionWithMouse = false;
        this.hasUserJustClickedOnShape = false;
        this.previousMousePosition = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
    }

    onKeyDown(event: KeyboardEvent): void {
        this.toolSelectionMoverService.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.toolSelectionMoverService.onKeyUp(event);
    }

    onElementClick(event: MouseEvent, element: SVGGraphicsElement): void {
        this.hasUserJustClickedOnShape = true;
        const isValidClick = !(
            this.toolSelectionStateService.isMovingSelectionWithArrows ||
            !this.isSingleClick() ||
            this.currentMouseButtonDown !== event.button
        );
        if (!isValidClick) {
            return;
        }

        if (event.button === MouseButton.Left) {
            this.toolSelectionStateService.selectedElements = [element];
        } else if (event.button === MouseButton.Right) {
            this.invertObjectsSelection([element], this.toolSelectionStateService.selectedElements);
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

    onToolSelection(): void {
        this.selectAllShortcutSubscription = this.shortcutService.selectAllShortcut$.subscribe(() => {
            this.toolSelectionStateService.selectedElements = [...this.drawingService.svgElements];
        });
    }

    onToolDeselection(): void {
        this.selectAllShortcutSubscription.unsubscribe();
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

    private isSingleClick(): boolean {
        const userSelectionRect = GeometryService.getRectFromPoints(this.selectionOrigin, Tool.mousePosition);
        return userSelectionRect.width === 0 && userSelectionRect.height === 0;
    }

    private updateSelectionOnMouseUp(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && this.isMouseDownInsideDrawing) {
            const isLeftButtonUp = event.button === MouseButton.Left && this.currentMouseButtonDown === event.button;
            if (!this.isSingleClick()) {
                const userSelectionRect = GeometryService.getRectFromPoints(this.selectionOrigin, Tool.mousePosition);
                const currentSelectedElements = this.svgUtilityService.getElementsUnderArea(
                    this.drawingService.svgElements,
                    userSelectionRect
                );
                const isRightButtonUp = this.currentMouseButtonDown === MouseButton.Right && this.currentMouseButtonDown === event.button;
                if (isLeftButtonUp) {
                    this.toolSelectionStateService.selectedElements = currentSelectedElements;
                } else if (isRightButtonUp) {
                    this.invertObjectsSelection(currentSelectedElements, this.toolSelectionStateService.selectedElements);
                }
            } else if (!this.hasUserJustClickedOnShape && isLeftButtonUp) {
                this.toolSelectionStateService.selectedElements = [];
            }
        }
    }

    private invertObjectsSelection(svgElementsToInverse: SVGGraphicsElement[], selection: SVGGraphicsElement[]): void {
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
