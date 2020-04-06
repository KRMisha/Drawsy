import { Injectable } from '@angular/core';
import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
// import { ToolSelectionUiService } from '@app/tools/services/selection/tool-selection-ui.service';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionMoverService {
    private totalSelectionMoveOffset: Vec2 = { x: 0, y: 0 };

    private isArrowUpHeld = false;
    private isArrowDownHeld = false;
    private isArrowLeftHeld = false;
    private isArrowRightHeld = false;

    private movingIntervalId?: number;
    private movingTimeout?: number;

    constructor(
        private drawingService: DrawingService,
        private toolSelectionStateService: ToolSelectionStateService,
        // private toolSelectionUiService: ToolSelectionUiService,
        private toolSelectionCollisionService: ToolSelectionCollisionService,
        private historyService: HistoryService
    ) {}

    onKeyDown(event: KeyboardEvent): void {
        this.setArrowStateFromEvent(event, true);
        const canAppendMatrix =
            this.toolSelectionStateService.state === SelectionState.None &&
            (this.isArrowUpHeld || this.isArrowDownHeld || this.isArrowLeftHeld || this.isArrowRightHeld);
        if (!canAppendMatrix) {
            return;
        }
        this.drawingService.appendNewMatrixToElements(this.toolSelectionStateService.selectedElements);
        this.toolSelectionStateService.state = SelectionState.MovingSelectionWithArrows;
        this.moveSelectionInArrowDirection();
        const timeoutDurationMs = 500;
        this.movingTimeout = window.setTimeout(() => {
            const movingIntervalMs = 100;
            this.movingIntervalId = window.setInterval(() => {
                this.moveSelectionInArrowDirection();
            }, movingIntervalMs);
        }, timeoutDurationMs);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.setArrowStateFromEvent(event, false);
        const canAddMoveCommand =
            !this.isArrowDownHeld &&
            !this.isArrowUpHeld &&
            !this.isArrowLeftHeld &&
            !this.isArrowRightHeld &&
            this.toolSelectionStateService.state !== SelectionState.MovingSelectionWithMouse;
        if (canAddMoveCommand) {
            if (this.totalSelectionMoveOffset.x !== 0 || this.totalSelectionMoveOffset.y !== 0) {
                this.addMoveCommand();
            }
            if (this.movingTimeout !== undefined) {
                window.clearTimeout(this.movingTimeout);
                this.movingTimeout = undefined;
            }
            window.clearInterval(this.movingIntervalId);
            this.movingIntervalId = undefined;
            this.toolSelectionStateService.state = SelectionState.None;
        }
    }

    startSelectionMove(): void {
        this.totalSelectionMoveOffset = { x: 0, y: 0};
    }

    moveSelection(currentMousePos: Vec2, lastMousePos: Vec2): void {
        const deltaMousePos: Vec2 = {
            x: currentMousePos.x - lastMousePos.x,
            y: currentMousePos.y - lastMousePos.y,
        };
        this.totalSelectionMoveOffset.x += deltaMousePos.x;
        this.totalSelectionMoveOffset.y += deltaMousePos.y;

        this.moveElementList(this.toolSelectionStateService.selectedElements, deltaMousePos);
        // this.toolSelectionUiService.setSelectedElementsRectFromElements(this.toolSelectionStateService.selectedElements);
        // this.toolSelectionStateService.updateSelectedElementsRect();
        this.toolSelectionStateService.selectedElementsRect =
            this.toolSelectionCollisionService.getElementListBounds(this.toolSelectionStateService.selectedElements);
    }

    addMoveCommand(): void {
        const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
        this.historyService.addCommand(new TransformElementsCommand(selectedElementsCopy));
        this.totalSelectionMoveOffset = { x: 0, y: 0 };
    }

    private moveElementList(elements: SVGGraphicsElement[], moveOffset: Vec2): void {
        for (const element of elements) {
            const lastTransformIndex = element.transform.baseVal.numberOfItems - 1;
            const newMatrix = element.transform.baseVal.getItem(lastTransformIndex).matrix.translate(moveOffset.x, moveOffset.y);
            element.transform.baseVal.getItem(lastTransformIndex).setMatrix(newMatrix);
        }
    }

    private moveSelectionInArrowDirection(): void {
        const moveDirection: Vec2 = { x: 0, y: 0 };
        const moveDelta = 3;
        if (this.isArrowLeftHeld !== this.isArrowRightHeld) {
            moveDirection.x = this.isArrowRightHeld ? moveDelta : -moveDelta;
        }
        if (this.isArrowUpHeld !== this.isArrowDownHeld) {
            moveDirection.y = this.isArrowDownHeld ? moveDelta : -moveDelta;
        }

        this.totalSelectionMoveOffset.x += moveDirection.x;
        this.totalSelectionMoveOffset.y += moveDirection.y;
        this.moveElementList(this.toolSelectionStateService.selectedElements, moveDirection);
        // this.toolSelectionUiService.setSelectedElementsRectFromElements(this.toolSelectionStateService.selectedElements);

        this.toolSelectionStateService.selectedElementsRect =
            this.toolSelectionCollisionService.getElementListBounds(this.toolSelectionStateService.selectedElements);
    }

    private setArrowStateFromEvent(event: KeyboardEvent, state: boolean): void {
        switch (event.key) {
            case 'ArrowUp':
                this.isArrowUpHeld = state;
                break;
            case 'ArrowDown':
                this.isArrowDownHeld = state;
                break;
            case 'ArrowLeft':
                this.isArrowLeftHeld = state;
                break;
            case 'ArrowRight':
                this.isArrowRightHeld = state;
                break;
        }
    }
}
