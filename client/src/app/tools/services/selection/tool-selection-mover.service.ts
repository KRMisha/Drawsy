import { Injectable } from '@angular/core';
import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { ArrowKey } from '@app/shared/enums/arrow-key.enum';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionMoverService {
    private totalSelectionMoveOffset: Vec2 = { x: 0, y: 0 };

    private arrowKeysHeldStates: boolean[] = [false, false, false, false];

    private movingTimeoutId: number;
    private movingIntervalId: number;

    constructor(
        private drawingService: DrawingService,
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionCollisionService: ToolSelectionCollisionService,
        private historyService: HistoryService
    ) {}

    onKeyDown(event: KeyboardEvent): void {
        const isArrowKey = event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight';
        if (!isArrowKey) {
            return;
        }

        this.setArrowStateFromEvent(event, true);

        const isNewSelectionMove =
            this.toolSelectionStateService.state === SelectionState.None && this.arrowKeysHeldStates.some((value: boolean) => value);
        if (isNewSelectionMove) {
            this.toolSelectionStateService.state = SelectionState.MovingSelectionWithArrows;

            this.drawingService.appendNewMatrixToElements(this.toolSelectionStateService.selectedElements);
            this.moveSelectionInArrowDirection();

            const timeoutDurationMs = 500;
            this.movingTimeoutId = window.setTimeout(() => {
                const movingIntervalMs = 100;
                this.movingIntervalId = window.setInterval(() => {
                    this.moveSelectionInArrowDirection();
                }, movingIntervalMs);
            }, timeoutDurationMs);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.toolSelectionStateService.state !== SelectionState.MovingSelectionWithArrows) {
            return;
        }

        this.setArrowStateFromEvent(event, false);

        const hasStoppedMovingWithKeys = this.arrowKeysHeldStates.every((value: boolean) => !value);
        if (hasStoppedMovingWithKeys) {
            this.toolSelectionStateService.state = SelectionState.None;

            window.clearTimeout(this.movingTimeoutId);
            window.clearInterval(this.movingIntervalId);

            this.addMoveCommand();
        }
    }

    startSelectionMove(): void {
        this.totalSelectionMoveOffset = { x: 0, y: 0 };
    }

    moveSelection(lastMousePos: Vec2, currentMousePos: Vec2): void {
        const deltaMousePos: Vec2 = {
            x: currentMousePos.x - lastMousePos.x,
            y: currentMousePos.y - lastMousePos.y,
        };

        this.totalSelectionMoveOffset.x += deltaMousePos.x;
        this.totalSelectionMoveOffset.y += deltaMousePos.y;
        this.moveSelectedElements(deltaMousePos);
    }

    addMoveCommand(): void {
        const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
        this.historyService.addCommand(new TransformElementsCommand(selectedElementsCopy));
        this.totalSelectionMoveOffset = { x: 0, y: 0 };
    }

    private setArrowStateFromEvent(event: KeyboardEvent, isKeyDown: boolean): void {
        switch (event.key) {
            case 'ArrowUp':
                this.arrowKeysHeldStates[ArrowKey.Up] = isKeyDown;
                break;
            case 'ArrowDown':
                this.arrowKeysHeldStates[ArrowKey.Down] = isKeyDown;
                break;
            case 'ArrowLeft':
                this.arrowKeysHeldStates[ArrowKey.Left] = isKeyDown;
                break;
            case 'ArrowRight':
                this.arrowKeysHeldStates[ArrowKey.Right] = isKeyDown;
                break;
        }
    }

    private moveSelectionInArrowDirection(): void {
        const moveOffset: Vec2 = { x: 0, y: 0 };
        const moveDelta = 3;
        if (this.arrowKeysHeldStates[ArrowKey.Left] !== this.arrowKeysHeldStates[ArrowKey.Right]) {
            moveOffset.x = this.arrowKeysHeldStates[ArrowKey.Right] ? moveDelta : -moveDelta;
        }
        if (this.arrowKeysHeldStates[ArrowKey.Up] !== this.arrowKeysHeldStates[ArrowKey.Down]) {
            moveOffset.y = this.arrowKeysHeldStates[ArrowKey.Down] ? moveDelta : -moveDelta;
        }

        this.totalSelectionMoveOffset.x += moveOffset.x;
        this.totalSelectionMoveOffset.y += moveOffset.y;
        this.moveSelectedElements(moveOffset);
    }

    private moveSelectedElements(moveOffset: Vec2): void {
        for (const element of this.toolSelectionStateService.selectedElements) {
            const lastTransformIndex = element.transform.baseVal.numberOfItems - 1;
            const newMatrix = element.transform.baseVal.getItem(lastTransformIndex).matrix.translate(moveOffset.x, moveOffset.y);
            element.transform.baseVal.getItem(lastTransformIndex).setMatrix(newMatrix);
        }
        this.toolSelectionStateService.selectedElementsRect = this.toolSelectionCollisionService.getElementListBounds(
            this.toolSelectionStateService.selectedElements
        );
    }
}
