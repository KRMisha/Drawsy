import { Injectable } from '@angular/core';
import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';
import { HistoryService } from '@app/drawing/services/history.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { ArrowKey } from '@app/shared/enums/arrow-key.enum';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionTransformService } from '@app/tools/services/selection/tool-selection-transform.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionMoverService {
    private arrowKeysHeldStates: boolean[] = [false, false, false, false];

    private movingTimeoutId: number;
    private movingIntervalId: number;

    private selectedElementTransformsBeforeMove: SVGTransform[][];

    constructor(
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionCollisionService: ToolSelectionCollisionService,
        private toolSelectionTransformService: ToolSelectionTransformService,
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
            this.startMovingSelectionWithArrows();
        }

        if (this.toolSelectionStateService.state === SelectionState.MovingSelectionWithArrows) {
            event.preventDefault();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.setArrowStateFromEvent(event, false);

        if (this.toolSelectionStateService.state !== SelectionState.MovingSelectionWithArrows) {
            return;
        }

        const hasStoppedMovingWithKeys = this.arrowKeysHeldStates.every((value: boolean) => !value);
        if (hasStoppedMovingWithKeys) {
            this.stopMovingSelection();
        }
    }

    startMovingSelection(): void {
        this.selectedElementTransformsBeforeMove = this.toolSelectionTransformService.getElementListTransformsCopy(
            this.toolSelectionStateService.selectedElements
        );
        this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
    }

    moveSelection(moveOffset: Vec2): void {
        for (const element of this.toolSelectionStateService.selectedElements) {
            this.moveElement(element, moveOffset);
        }
        this.toolSelectionStateService.selectedElementsBounds = this.toolSelectionCollisionService.getElementListBounds(
            this.toolSelectionStateService.selectedElements
        );
    }

    stopMovingSelection(): void {
        if (
            this.toolSelectionStateService.state !== SelectionState.MovingSelectionWithMouse &&
            this.toolSelectionStateService.state !== SelectionState.MovingSelectionWithArrows
        ) {
            return;
        }

        const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
        this.historyService.addCommand(
            new TransformElementsCommand(
                selectedElementsCopy,
                this.selectedElementTransformsBeforeMove,
                this.toolSelectionTransformService.getElementListTransformsCopy(this.toolSelectionStateService.selectedElements)
            )
        );

        if (this.toolSelectionStateService.state === SelectionState.MovingSelectionWithArrows) {
            window.clearTimeout(this.movingTimeoutId);
            window.clearInterval(this.movingIntervalId);
        }

        this.toolSelectionStateService.state = SelectionState.None;
    }

    reset(): void {
        this.arrowKeysHeldStates.fill(false);
        this.stopMovingSelection();
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

    private moveElement(element: SVGGraphicsElement, moveOffset: Vec2): void {
        const translateTransformIndex = 0;
        const newMatrix = element.transform.baseVal.getItem(translateTransformIndex).matrix.translate(moveOffset.x, moveOffset.y);
        element.transform.baseVal.getItem(translateTransformIndex).setMatrix(newMatrix);
    }

    private startMovingSelectionWithArrows(): void {
        this.toolSelectionStateService.state = SelectionState.MovingSelectionWithArrows;

        this.startMovingSelection();

        this.moveSelectionWithArrows();

        const timeoutDurationMs = 500;
        this.movingTimeoutId = window.setTimeout(() => {
            const movingIntervalMs = 100;
            this.movingIntervalId = window.setInterval(() => {
                this.moveSelectionWithArrows();
            }, movingIntervalMs);
        }, timeoutDurationMs);
    }

    private moveSelectionWithArrows(): void {
        const moveOffset: Vec2 = { x: 0, y: 0 };
        const moveDelta = 3;
        if (this.arrowKeysHeldStates[ArrowKey.Left] !== this.arrowKeysHeldStates[ArrowKey.Right]) {
            moveOffset.x = this.arrowKeysHeldStates[ArrowKey.Right] ? moveDelta : -moveDelta;
        }
        if (this.arrowKeysHeldStates[ArrowKey.Up] !== this.arrowKeysHeldStates[ArrowKey.Down]) {
            moveOffset.y = this.arrowKeysHeldStates[ArrowKey.Down] ? moveDelta : -moveDelta;
        }

        this.moveSelection(moveOffset);
    }
}
