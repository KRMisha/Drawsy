import { Injectable, OnDestroy, RendererFactory2 } from '@angular/core';
import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { ElementSiblingPair } from '@app/drawing/classes/element-sibling-pair';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import ToolInfo from '@app/tools/constants/tool-info';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionRotatorService } from '@app/tools/services/selection/tool-selection-rotator.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionUiService } from '@app/tools/services/selection/tool-selection-ui.service';
import { Tool } from '@app/tools/services/tool';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool implements OnDestroy {
    private selectionOrigin: Vec2;
    private currentMouseButtonDown?: MouseButton;
    private previousMousePosition: Vec2;

    private selectedElementsAfterInversion: SVGGraphicsElement[] = [];

    private selectAllShortcutSubscription: Subscription;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionMoverService: ToolSelectionMoverService,
        private toolSelectionRotatorService: ToolSelectionRotatorService,
        private toolSelectionUiService: ToolSelectionUiService,
        private toolSelectionCollisionService: ToolSelectionCollisionService,
        private shortcutService: ShortcutService
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Selection);
    }

    ngOnDestroy(): void {
        this.selectAllShortcutSubscription.unsubscribe();
    }

    onMouseMove(event: MouseEvent): void {
        switch (this.toolSelectionStateService.state) {
            case SelectionState.None:
            case SelectionState.MovingSelectionWithArrows:
                break;

            case SelectionState.SelectionMoveStartClick:
                this.toolSelectionStateService.state = SelectionState.MovingSelectionWithMouse;
            case SelectionState.MovingSelectionWithMouse:
                const mouseMovement = Vec2.subtract(Tool.mousePosition, this.previousMousePosition);
                this.toolSelectionMoverService.moveSelection(mouseMovement);
                break;

            case SelectionState.SelectionChangeStartClick:
                this.toolSelectionStateService.state = SelectionState.ChangingSelection;
            case SelectionState.ChangingSelection:
                const userSelectionRect = Rect.fromPoints(this.selectionOrigin, Tool.mousePosition);
                this.toolSelectionUiService.setUserSelectionRect(userSelectionRect);
                if (this.currentMouseButtonDown === MouseButton.Left) {
                    this.toolSelectionStateService.selectedElements =
                        this.toolSelectionCollisionService.getElementsUnderArea(userSelectionRect);
                } else {
                    this.selectedElementsAfterInversion = [...this.toolSelectionStateService.selectedElements];
                    const elementsToInvert = this.toolSelectionCollisionService.getElementsUnderArea(userSelectionRect);
                    this.invertElementsSelection(elementsToInvert, this.selectedElementsAfterInversion);
                    this.toolSelectionStateService.selectedElementsBounds = this.toolSelectionCollisionService.getElementListBounds(
                        this.selectedElementsAfterInversion
                    );
                }
                break;
        }

        this.toolSelectionUiService.updateUserSelectionRectCursor(this.toolSelectionStateService.state);
        this.previousMousePosition = {
            x: Tool.mousePosition.x,
            y: Tool.mousePosition.y,
        };
    }

    onMouseDown(event: MouseEvent): void {
        const isMouseButtonInvalid = event.button !== MouseButton.Left && event.button !== MouseButton.Right;
        if (isMouseButtonInvalid) {
            return;
        }

        const isMouseButtonAlreadyPressed = this.currentMouseButtonDown !== undefined;
        if (this.toolSelectionStateService.state === SelectionState.MovingSelectionWithArrows || isMouseButtonAlreadyPressed) {
            return;
        }

        if (!Tool.isMouseInsideDrawing) {
            this.toolSelectionStateService.state = SelectionState.None;
            return;
        }

        this.currentMouseButtonDown = event.button;
        this.selectionOrigin = {
            x: Tool.mousePosition.x,
            y: Tool.mousePosition.y,
        };

        if (this.isMouseInsideSelectedElementBounds() && event.button === MouseButton.Left) {
            this.toolSelectionStateService.state = SelectionState.SelectionMoveStartClick;
            this.toolSelectionMoverService.startMovingSelection();
        } else {
            this.toolSelectionStateService.state = SelectionState.SelectionChangeStartClick;
            const userSelectionRect = Rect.fromPoints(this.selectionOrigin, this.selectionOrigin);
            this.toolSelectionUiService.setUserSelectionRect(userSelectionRect);
            this.toolSelectionUiService.showUserSelectionRect();
        }

        this.toolSelectionUiService.updateUserSelectionRectCursor(this.toolSelectionStateService.state);
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button !== this.currentMouseButtonDown) {
            return;
        }

        this.toolSelectionUiService.hideUserSelectionRect();

        switch (this.toolSelectionStateService.state) {
            case SelectionState.ChangingSelection:
                if (event.button === MouseButton.Right) {
                    this.toolSelectionStateService.selectedElements = this.selectedElementsAfterInversion;
                }
                break;
            case SelectionState.MovingSelectionWithMouse:
                this.toolSelectionMoverService.stopMovingSelection();
                break;
            case SelectionState.MovingSelectionWithArrows:
                return;
            case SelectionState.SelectionChangeStartClick:
            case SelectionState.SelectionMoveStartClick:
                const element = this.drawingService.findDrawingChildElement(event.target);
                if (event.button === MouseButton.Left) {
                    if (element === undefined) {
                        this.toolSelectionStateService.selectedElements = [];
                    } else {
                        this.toolSelectionStateService.selectedElements = [element];
                    }
                } else if (element !== undefined) {
                    this.invertElementsSelection([element], this.toolSelectionStateService.selectedElements);
                    this.toolSelectionStateService.selectedElementsChanged$.next(this.toolSelectionStateService.selectedElements);
                }
                break;
            default:
                break;
        }

        this.toolSelectionStateService.state = SelectionState.None;
        this.currentMouseButtonDown = undefined;
        this.toolSelectionUiService.updateUserSelectionRectCursor(this.toolSelectionStateService.state);
    }

    onScroll(event: WheelEvent): void {
        this.toolSelectionRotatorService.onScroll(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Backspace':
            case 'Delete':
                this.deleteSelection();
                break;
            case 'Escape':
                this.toolSelectionStateService.selectedElements = [];
                this.reset();
                break;
            default:
                this.toolSelectionMoverService.onKeyDown(event);
                break;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.toolSelectionMoverService.onKeyUp(event);
    }

    onFocusOut(): void {
        this.reset();
    }

    onToolSelection(): void {
        this.selectAllShortcutSubscription = this.shortcutService.selectAllShortcut$.subscribe(() => {
            this.toolSelectionStateService.selectedElements = [...this.drawingService.elements];
        });
    }

    onToolDeselection(): void {
        this.selectAllShortcutSubscription.unsubscribe();
        this.toolSelectionStateService.selectedElements = [];
        this.reset();
    }

    onHistoryChange(): void {
        const elements = new Set<SVGGraphicsElement>(this.drawingService.elements);
        this.toolSelectionStateService.selectedElements = this.toolSelectionStateService.selectedElements.filter(
            (element: SVGGraphicsElement) => elements.has(element)
        );
    }

    onDrawingLoad(): void {
        this.toolSelectionStateService.selectedElements = [];
        this.reset();
    }

    deleteSelection(): void {
        if (this.toolSelectionStateService.selectedElements.length === 0) {
            return;
        }

        const elementIndices = new Map<SVGGraphicsElement, number>(
            this.drawingService.elements.map((element: SVGGraphicsElement, index: number) => [element, index])
        );
        this.toolSelectionStateService.selectedElements.sort((element1: SVGGraphicsElement, element2: SVGGraphicsElement) => {
            // Map will always have indices for elements since their insertion is guaranteed just prior
            // tslint:disable-next-line: no-non-null-assertion
            return elementIndices.get(element2)! - elementIndices.get(element1)!;
        });

        const elementSiblingPairs: ElementSiblingPair[] = [];
        for (const selectedElement of this.toolSelectionStateService.selectedElements) {
            elementSiblingPairs.push({
                element: selectedElement,
                sibling: (selectedElement.nextSibling as SVGGraphicsElement) ?? undefined,
            });
            this.drawingService.removeElement(selectedElement);
        }
        this.toolSelectionStateService.selectedElements = [];

        this.historyService.addCommand(new RemoveElementsCommand(this.drawingService, elementSiblingPairs));
    }

    private isMouseInsideSelectedElementBounds(): boolean {
        if (this.toolSelectionStateService.selectedElementsBounds === undefined) {
            return false;
        }
        return this.toolSelectionCollisionService.isPointInRect(Tool.mousePosition, this.toolSelectionStateService.selectedElementsBounds);
    }

    private invertElementsSelection(elementsToInvert: SVGGraphicsElement[], selectedElements: SVGGraphicsElement[]): void {
        for (const element of elementsToInvert) {
            const elementToRemoveIndex = selectedElements.indexOf(element, 0);
            if (elementToRemoveIndex !== -1) {
                selectedElements.splice(elementToRemoveIndex, 1);
            } else {
                selectedElements.push(element);
            }
        }
    }

    private reset(): void {
        this.currentMouseButtonDown = undefined;
        this.toolSelectionMoverService.reset();
        this.toolSelectionUiService.reset();
        this.toolSelectionStateService.state = SelectionState.None;
    }
}
